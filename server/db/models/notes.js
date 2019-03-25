const Sequelize = require('sequelize')
const parseMarkdown = require('parse-markdown-links')
const noteNotes = require('./noteNote')
if (!process.env.HOST_URL) require('./../../../secrets')
const {es, db} = require('../db')
const Notes = db.define('notes', {
  title: {
    type: Sequelize.STRING,
    defaultValue: 'Untitled Note'
  },
  content: {
    type: Sequelize.JSON
  }
})

// Elastic Search Operations
const singleIndexForES = async instance => {
  try {
    const body = instance.dataValues
    await es.index({
      index: 'notes',
      body
    })
  } catch (error) {
    console.log(error)
  }
}

const bulkIndexForES = async instances => {
  try {
    const indexArr = []
    instances.forEach(instance => {
      indexArr.push({
        index: {
          _index: 'notes',
          _type: '_doc'
        }
      })
      indexArr.push({
        ...instance.dataValues
      })
    })
    await es.bulk({
      body: indexArr
    })
  } catch (error) {
    console.log(error)
  }
}

const updateForES = async instance => {
  try {
    const dbId = instance.dataValues.id
    const esResult = await es.search({
      index: 'notes',
      body: {
        query: {
          term: {
            id: dbId
          }
        }
      }
    })

    const esId = esResult.body.hits.hits[0]._id
    const sourceIdFromES = esResult.body.hits.hits[0]._source.id

    if (dbId === sourceIdFromES) {
      await es.index({
        index: 'notes',
        id: esId,
        body: instance.dataValues
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const deleteForES = async instance => {
  try {
    const dbId = instance.dataValues.id
    const esResult = await es.search({
      index: 'notes',
      body: {
        query: {
          term: {
            id: dbId
          }
        }
      }
    })

    const esId = esResult.body.hits.hits[0]._id
    const sourceIdFromES = esResult.body.hits.hits[0]._source.id

    if (dbId === sourceIdFromES) {
      await es.delete({
        index: 'notes',
        id: esId
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// Association Parsing Operations

const extractNoteIds = (cells, sourceId) => {
  const findNoteURLs = new RegExp(`${process.env.HOST_URL}/notes\/\\d+`)
  const replaceURLsWithIds = new RegExp(/.*\/notes\/(\d+).*/)

  return new Set(
    cells
      .filter(cell => cell.type === 'markdown')
      .map(cell => parseMarkdown(cell.content))
      .flat()
      .filter(el => findNoteURLs.test(el))
      .map(el => parseInt(el.replace(replaceURLsWithIds, '$1'), 10))
      .filter(el => el !== sourceId)
  )
}

const parseAndUpdateRefsAfterCreation = instance => {
  const sourceId = instance.dataValues.id
  const noteIds = extractNoteIds(instance.dataValues.content.cells, sourceId)
  if (noteIds.size)
    noteIds.forEach(async el => {
      try {
        await noteNotes.create({
          sourceId,
          targetId: el,
          type: 'inline'
        })
      } catch (error) {
        console.log(error)
      }
    })
}

const parseAndUpdateRefsAfterUpdate = async instance => {
  const sourceId = instance.dataValues.id
  const noteIds = extractNoteIds(instance.dataValues.content.cells, sourceId)
  try {
    const potentialDeletedNotes = await noteNotes.findAll({
      where: {
        sourceId,
        type: 'inline'
      }
    })
    potentialDeletedNotes.forEach(async note => {
      if (!noteIds.has(note.dataValues.targetId)) {
        await note.destroy()
      }
    })
  } catch (error) {
    console.log(error)
  }
  if (noteIds.size)
    noteIds.forEach(async el => {
      try {
        await noteNotes.findOrCreate({
          where: {
            sourceId: instance.dataValues.id,
            targetId: el,
            type: 'inline'
          }
        })
      } catch (error) {
        console.log(error)
      }
    })
}

// Creation Hooks
Notes.afterCreate(instance => {
  singleIndexForES(instance)
  parseAndUpdateRefsAfterCreation(instance)
})

Notes.afterBulkCreate(instances => {
  bulkIndexForES(instances)
  instances.forEach(instance => {
    parseAndUpdateRefsAfterUpdate(instance)
  })
})

// Update Hooks
Notes.afterUpdate(instance => {
  parseAndUpdateRefsAfterUpdate(instance)
  updateForES(instance)
})

// Delete Hooks
Notes.afterDelete(instance => {
  deleteForES(instance)
})

module.exports = Notes

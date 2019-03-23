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

// Association Parsing Operations
const parseAndUpdateRefs = instance => {
  const findNoteURLs = new RegExp(`${process.env.HOST_URL}/notes\/\\d+`)
  const replaceURLsWithIds = new RegExp(/.*\/notes\/(\d+).*/)

  const noteIds = new Set(
    instance.dataValues.content.cells
      .filter(cell => cell.type === 'markdown')
      .map(cell => parseMarkdown(cell.content))
      .flat()
      .filter(el => findNoteURLs.test(el))
      .map(el => parseInt(el.replace(replaceURLsWithIds, '$1'), 10))
  )

  if (noteIds.size)
    noteIds.forEach(async el => {
      try {
        await noteNotes.create({
          sourceId: instance.dataValues.id,
          targetId: el,
          type: 'inline'
        })
      } catch (error) {
        console.log(error)
      }
    })
}

// Creation Hooks
Notes.afterCreate(instance => {
  singleIndexForES(instance)
  parseAndUpdateRefs(instance)
})

Notes.afterBulkCreate(instances => {
  bulkIndexForES(instances)
  instances.forEach(instance => {
    parseAndUpdateRefs(instance)
  })
})

// Update Hooks
// Notes.afterUpdate();

// Delete Hooks
// Notes.afterDelete();

module.exports = Notes

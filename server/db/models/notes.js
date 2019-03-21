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

const indexForES = async instances => {
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

const parseAndUpdateRefs = instances => {
  instances.forEach(instance => {
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
  })
}

Notes.afterBulkCreate(instances => {
  parseAndUpdateRefs(instances)
  indexForES(instances)
})

module.exports = Notes

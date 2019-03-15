const Sequelize = require('sequelize')
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

const indexForES = instances => {
  instances.forEach(async instance => {
    try {
      const body = instance.dataValues
      await es.index({
        index: 'notes',
        body
      })
    } catch (error) {
      console.log(error)
    }
  })
}

Notes.beforeBulkCreate(instances => indexForES(instances))

module.exports = Notes

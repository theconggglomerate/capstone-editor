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
    console.log(error.meta)
  }
}

Notes.afterBulkCreate(instances => indexForES(instances))

module.exports = Notes

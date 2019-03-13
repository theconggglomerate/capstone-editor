const Sequelize = require('sequelize')
const db = require('../db')

const Notes = db.define('notes', {
  title: {
    type: Sequelize.STRING,
    defaultValue: 'Untitled Note'
  },
  content: {
    type: Sequelize.JSON,
  },
})

module.exports = Notes

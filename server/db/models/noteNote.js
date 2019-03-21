const {db} = require('../db')
const Sequelize = require('sequelize')

const noteNotes = db.define('noteNotes', {
  type: {
    type: Sequelize.ENUM('general', 'inline'),
    allowNull: false
  }
})

module.exports = noteNotes

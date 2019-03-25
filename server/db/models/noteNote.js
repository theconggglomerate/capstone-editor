const {db} = require('../db')
const Sequelize = require('sequelize')

const noteNotes = db.define('noteNotes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: Sequelize.ENUM('general', 'inline'),
    allowNull: false
  }
})

module.exports = noteNotes

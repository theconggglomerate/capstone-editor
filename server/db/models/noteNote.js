const {db} = require('../db')
const Sequelize = require('sequelize')

const noteNotes = db.define('noteNotes', {})

module.exports = noteNotes

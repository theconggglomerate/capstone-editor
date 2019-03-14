const User = require('./user')
const Notes = require('./notes')
const noteNotes = require('./noteNote')

Notes.belongsToMany(Notes, {
  as: 'source',
  foreignKey: 'sourceId',
  through: noteNotes
})
Notes.belongsToMany(Notes, {
  as: 'target',
  foreignKey: 'targetId',
  through: noteNotes
})

Notes.belongsTo(User)
User.hasMany(Notes)

module.exports = {
  User,
  Notes,
  noteNotes
}

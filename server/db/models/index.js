const User = require('./user')
const Notes = require('./notes')

Notes.belongsToMany(Notes, {as: 'Note-1', through: 'note-note'})
Notes.belongsToMany(Notes, {as: 'Note-2', through: 'note-note'})

Notes.belongsTo(User)
User.hasMany(Notes)

module.exports = {
  User,
  Notes
}

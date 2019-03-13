const User = require('./user')
const Notes = require('./notes')

Notes.belongsToMany(Notes, {through: 'note-note'})
Notes.belongsToMany(Notes, {through: 'note-note'})

Notes.belongsTo(User)
User.hasMany(Notes)

module.exports = {
  User,
  Notes
}

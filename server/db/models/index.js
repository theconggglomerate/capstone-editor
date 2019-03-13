const User = require('./user');
const Notes = require('./notes');

Notes.hasMany(Notes, {through: 'note-note'});
Notes.hasMany(Notes, {through: 'note-note'});

Notes.belongsTo(User);
User.hasMany(Notes);

module.exports = {
  User,
  Notes
}

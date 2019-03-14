const {es, db} = require('./db')

// register models
require('./models')

module.exports = {
  es,
  db
}

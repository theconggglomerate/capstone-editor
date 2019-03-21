const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/noteNotes', require('./noteNotes'))
router.use('/notes', require('./notes'))
router.use('/es', require('./es'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

const router = require('express').Router()
const {Notes, noteNotes} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const associations = await noteNotes.findAll()
    res.send(associations)
  } catch (err) {
    next(err)
  }
})

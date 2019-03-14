const router = require('express').Router()
const {Notes} = require('./../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const notes = await Notes.findAll()
    res.json(notes)
  } catch (error) {
    next(error)
  }
})

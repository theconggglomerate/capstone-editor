const router = require('express').Router()
const {Notes} = require('./../db/models')
module.exports = router

router.param('noteId', async (req, res, next, id) => {
  try {
    const note = await Notes.findByPk(id)
    if (note) {
      req.note = note
      next()
    } else res.status(404).send('404 Error: Note Not Found')
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const notes = await Notes.findAll()
    res.json(notes)
  } catch (error) {
    next(error)
  }
})

router.get('/:noteId', (req, res, next) => {
  try {
    res.send(req.note)
  } catch (error) {
    next(error)
  }
})

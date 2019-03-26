const router = require('express').Router()
const {Notes} = require('./../db/models')
module.exports = router

router.param('noteId', async (req, res, next, id) => {
  try {
    const note = await Notes.findByPk(id, {
      include: [
        {model: Notes, as: 'source', attributes: ['id', 'title']},
        {model: Notes, as: 'target', attributes: ['id', 'title']}
      ]
    })
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

router.post('/', async (req, res, next) => {
  try {
    const note = await Notes.create(req.body)

    res.status(200).send({id: note.id})
  } catch (err) {
    next(err)
  }
})

router.put('/:noteId', async (req, res, next) => {
  try {
    if (req.note) {
      const note = await req.note.update(req.body)
      res.status(200).send(note)
    }
  } catch (err) {
    next(err)
  }
})

router.delete('/:noteId', async (req, res, next) => {
  try {
    if (req.note) {
      const note = await req.note.destroy()
      res.sendStatus(200)
    }
  } catch (err) {
    next(err)
  }
})

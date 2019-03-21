const router = require('express').Router()
const {Notes, noteNotes} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const associations = await Notes.findAll({
      include: [
        {
          model: Notes,
          as: 'source',
          attributes: ['id', 'title']
        }
      ]
    })
    let edges = []
    const nodes = associations.map(note => {
      note.source.forEach(target => {
        edges.push({
          data: {
            source: target.noteNotes.sourceId,
            target: target.id
          }
        })
      })
      return {
        data: {
          id: note.id,
          label: note.title.slice(0, 10)
        }
      }
    })
    res.send({
      nodes,
      edges
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const noteId = req.params.id
    const noteSource = await Notes.findOne({
      where: {
        id: noteId
      },
      include: [
        {
          model: Notes,
          as: 'source',
          attributes: ['id', 'title']
        }
      ]
    })
    const noteTarget = await Notes.findOne({
      where: {
        id: noteId
      },
      include: [
        {
          model: Notes,
          as: 'target',
          attributes: ['id', 'title']
        }
      ]
    })
    const sourceArr = noteSource.source.concat(noteTarget.target)
    noteSource.source = sourceArr
    const note = noteSource

    let noteArray = [
      {
        data: {
          id: noteId,
          label: note.title.slice(0, 10)
        }
      }
    ]
    let edges = note.source.map(target => {
      noteArray.push({
        data: {
          id: target.id,
          label: target.title.slice(0, 10)
        }
      })
      return {
        data: {
          source: target.noteNotes.sourceId,
          target: target.noteNotes.targetId
        }
      }
    })
    const noteObject = {
      nodes: noteArray,
      edges
    }
    res.send(noteObject)
  } catch (err) {
    next(err)
  }
})

router.post('/newAssociation', (req, res, next) => {
  try {
    const sourceId = req.body.sourceId
    const targetId = req.body.targetId

    noteNotes.create({
      sourceId,
      targetId,
      type: 'general'
    })
  } catch (err) {
    next(err)
  }
})

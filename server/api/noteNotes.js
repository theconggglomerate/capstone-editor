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
          label: note.title
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
          label: note.title
        }
      }
    ]
    let edges = note.source.map(target => {
      noteArray.push({
        data: {
          id: target.id,
          label: target.title
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

router.post('/newAssociation', async (req, res, next) => {
  try {
    const sourceId = parseInt(req.body.sourceId, 10)
    const targetId = parseInt(req.body.targetId, 10)
    if (sourceId === targetId)
      res.status(403).send('403: Cannot associate note with itself.')
    else {
      const assocTry1 = await noteNotes.findOne({
        where: {
          sourceId: sourceId,
          targetId: targetId,
          type: 'general'
        }
      })
      const assocTry2 = await noteNotes.findOne({
        where: {
          sourceId: targetId,
          targetId: sourceId,
          type: 'general'
        }
      })

      const success = assocTry1 || assocTry2
      if (success) {
        res.status(409).send('409: Association already exists.')
      } else {
        await noteNotes.create({
          sourceId,
          targetId,
          type: 'general'
        })
        const note = await Notes.findByPk(sourceId, {
          include: [
            {
              model: Notes,
              as: 'source',
              attributes: ['id', 'title']
            },
            {
              model: Notes,
              as: 'target',
              attributes: ['id', 'title']
            }
          ]
        })
        res.status(200).send(note)
      }
    }
  } catch (err) {
    next(err)
  }
})

router.delete('/association', async (req, res, next) => {
  try {
    const sourceId = parseInt(req.body.sourceId, 10)
    const targetId = parseInt(req.body.targetId, 10)

    const assocTry1 = await noteNotes.findOne({
      where: {
        sourceId: sourceId,
        targetId: targetId,
        type: 'general'
      }
    })

    const assocTry2 = await noteNotes.findOne({
      where: {
        sourceId: targetId,
        targetId: sourceId,
        type: 'general'
      }
    })

    const success = assocTry1 || assocTry2

    if (success) {
      await success.destroy()
      const updated = await Notes.findByPk(sourceId, {
        include: [
          {
            model: Notes,
            as: 'source',
            attributes: ['id', 'title']
          },
          {
            model: Notes,
            as: 'target',
            attributes: ['id', 'title']
          }
        ]
      })
      res.send(updated)
    } else {
      res.sendStatus(500)
    }
  } catch (err) {
    next(err)
  }
})

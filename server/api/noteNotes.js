const router = require('express').Router()
const {Notes, noteNotes} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const associations = await Notes.findAll({
      include: [{model: Notes, as: 'source', attributes: ['id', 'title']}]
    })
    let edges = []
    const nodes = associations.map(note => {
      note.source.forEach(target => {
        edges.push({
          data: {source: target.noteNotes.sourceId, target: target.id}
        })
      })
      return {data: {id: note.id, name: note.title}}
    })
    res.send({nodes, edges})
  } catch (err) {
    next(err)
  }
})

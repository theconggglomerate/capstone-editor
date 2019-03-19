import Axios from 'axios'

//Action types

const NEW_CODE_BLOCK = 'NEW_CODE_BLOCK'
const NEW_MARKDOWN_BLOCK = 'NEW_MARKDOWN_BLOCK'
const EDIT_BLOCK = 'EDIT_BLOCK'
const SET_EDITOR = 'SET_EDITOR'

//Action Creators

export const makeCodeBlock = () => ({
  type: NEW_CODE_BLOCK
})

export const makeMarkdownBlock = () => ({
  type: NEW_MARKDOWN_BLOCK
})

export const editBlock = (content, index) => ({
  type: EDIT_BLOCK,
  index,
  content
})

export const setEditor = cells => ({
  type: SET_EDITOR,
  cells
})

//Thunks

export const createProject = (title, content, history) => {
  return async function(dispatch) {
    const note = {title, content: {cells: content}}
    const id = await Axios.post('/api/notes/', note)
    console.log(id.data.id)
    if (history) {
      history.push(`/editor/${id.data.id}`)
    }
  }
}

export const getProject = id => {
  return async function(dispatch) {
    const note = await Axios.get(`/api/notes/${id}`)
    console.log(note.data)
    dispatch(setEditor(note.data.content.cells))
  }
}

export const saveProject = (id, title, content) => {
  return async function(dispatch) {
    const note = {title, content: {cells: content}}
    const updatedNote = await Axios.put(`/api/notes/${id}`, note)
    dispatch(setEditor(updatedNote.data.content.cells))
  }
}

//Reducer

const initialState = []

export const editor = (state = initialState, action) => {
  switch (action.type) {
    case NEW_CODE_BLOCK:
      return [...state, {type: 'code', content: ''}]
    case NEW_MARKDOWN_BLOCK:
      return [...state, {type: 'markdown', content: ''}]
    case EDIT_BLOCK:
      const blockArr = [...state]
      blockArr[action.index].content = action.content
      return [...blockArr]
    case SET_EDITOR:
      return [...action.cells]
    default:
      return state
  }
}

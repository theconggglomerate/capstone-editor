import Axios from 'axios'

//Action types

const NEW_CODE_BLOCK = 'NEW_CODE_BLOCK'
const NEW_MARKDOWN_BLOCK = 'NEW_MARKDOWN_BLOCK'
const EDIT_BLOCK = 'EDIT_BLOCK'
const SET_EDITOR = 'SET_EDITOR'
const CLEAR_EDITOR = 'CLEAR_EDITOR'
const EDIT_TITLE = 'EDIT_TITLE'

//Action Creators

export const editTitle = title => ({
  type: EDIT_TITLE,
  title
})

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

export const setEditor = (cells, title, id) => ({
  type: SET_EDITOR,
  cells,
  title,
  id
})

export const clearEditor = () => ({
  type: CLEAR_EDITOR
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
    dispatch(setEditor(note.data.content.cells, note.data.title, note.data.id))
  }
}

export const saveProject = (id, title, content) => {
  return async function(dispatch) {
    const note = {title, content: {cells: content}}
    const updatedNote = await Axios.put(`/api/notes/${id}`, note)
    dispatch(
      setEditor(
        updatedNote.data.content.cells,
        updatedNote.data.title,
        updatedNote.data.id
      )
    )
  }
}

//Reducer

const initialState = {title: '', cells: []}

export const editor = (state = initialState, action) => {
  switch (action.type) {
    case NEW_CODE_BLOCK:
      return {
        ...state,
        cells: [...state.cells, {type: 'code', content: ''}]
      }
    case NEW_MARKDOWN_BLOCK:
      return {
        ...state,
        cells: [...state.cells, {type: 'markdown', content: ''}]
      }
    case EDIT_BLOCK:
      const blockArr = [...state.cells]
      blockArr[action.index].content = action.content
      return {...state, cells: [...blockArr]}
    case SET_EDITOR:
      return {id: action.id, title: action.title, cells: [...action.cells]}
    case EDIT_TITLE:
      return {...state, title: action.title}

    case CLEAR_EDITOR:
      return {title: '', cells: [], id: null}
    default:
      return state
  }
}

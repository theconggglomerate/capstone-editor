import Axios from 'axios'

// Action Types
const GET_NOTES = 'GET_NOTES'

// Action Creators
const getNotes = notes => ({
  type: GET_NOTES,
  notes
})

// Thunks
export const fetchNotes = () => async dispatch => {
  try {
    const {data: notes} = await Axios.get('/api/notes')
    dispatch(getNotes(notes))
  } catch (error) {
    console.log(error)
  }
}

// Reducer
const initialState = []

const dispatchers = {
  [GET_NOTES]: (state, action) => action.notes
}

export default (state = initialState, action) => {
  if (action.type in dispatchers) return dispatchers[action.type](state, action)
  return state
}

import Axios from 'axios'

// Action Types
const GET_ALL_ELEMENTS = 'GET_ALL_ELEMENTS'
const GET_SINGLE_WEB = 'GET_SINGLE_WEB'

// Action Creators
const getElements = elements => ({
  type: GET_ALL_ELEMENTS,
  elements
})

const getSingleWeb = elements => ({
  type: GET_SINGLE_WEB,
  elements
})

// Thunks
export const fetchElements = () => async dispatch => {
  try {
    const {data: elements} = await Axios.get('/api/noteNotes')
    dispatch(getElements(elements))
  } catch (error) {
    console.log(error)
  }
}

export const fetchSingleWeb = id => async dispatch => {
  try {
    const {data: elements} = await Axios.get(`/api/noteNotes/${id}`)
    dispatch(getSingleWeb(elements))
  } catch (error) {
    console.log(error)
  }
}


const initialState = {
  allElements: {},
  singleWeb: {}
}

const dispatchers = {
  [GET_ALL_ELEMENTS]: (state, action) => ({
    ...state,
    allElements: action.elements
  }),
  [GET_SINGLE_WEB]: (state, action) => ({
    ...state,
    singleWeb: action.elements
  })
}

export default (state = initialState, action) => {
  if (action.type in dispatchers) return dispatchers[action.type](state, action)
  return state
}

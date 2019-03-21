import Axios from 'axios'

//Action Types

const TURN_ON_MODAL = 'MODAL_ON'
const TURN_OFF_MODAL = 'MODAL_OFF'
const LOAD_PAGE = 'LOAD_PAGE'

// Action Creators

export const getModal = id => ({
  type: TURN_ON_MODAL,
  id
})
export const turnOffModal = () => ({
  type: TURN_OFF_MODAL
})

export const loadPage = () => ({
  type: LOAD_PAGE
})

//THUNKS

// export const getModal = (id) => async dispatch => {
//     try{
//         const {data: elements} = await Axios.get(`/api/noteNotes/${id}`)
//         dispatch(turnOnModal(elements))
//     }catch(err){next(err)}
// }

//Reducer

const initialState = {modal: false, id: null, loaded: false}

export default (state = initialState, action) => {
  switch (action.type) {
    case TURN_ON_MODAL:
      return {...state, modal: true, id: action.id}
    case TURN_OFF_MODAL:
      return {...state, modal: false, id: null, loaded: true}
    case LOAD_PAGE:
      return {...state, modal: false, loaded: false}
    default:
      return state
  }
}

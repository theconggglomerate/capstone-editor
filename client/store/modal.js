import Axios from 'axios'

//Action Types

const TURN_ON_MODAL = 'MODAL_ON'
const TURN_OFF_MODAL = 'MODAL_OFF'
const LOAD_PAGE = 'LOAD_PAGE'
const DELETE_POPUP = 'DELETE_POPUP'
const DELETE_CONFIRM = 'DELETE_CONFIRM'
const DELETE_CANCEL = 'DELETE_CANCEL'
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

export const deletePopup = id => ({
  type: DELETE_POPUP,
  deleteId: id
})

export const deleteCancel = () => ({
  type: DELETE_CANCEL
})

export const deleteConfirm = () => ({})

// THUNKS

export const deleteNote = id =>
  async function(dispatch) {
    const deleter = await Axios.delete(`/api/notes/${id}`)
    if (deleter.status === 200) {
      dispatch(turnOffModal())
    }
  }

//Reducer

const initialState = {
  modal: false,
  id: null,
  loaded: false,
  warning: false,
  deleteId: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TURN_ON_MODAL:
      return {...state, modal: true, id: action.id}
    case TURN_OFF_MODAL:
      return {
        ...state,
        modal: false,
        id: null,
        loaded: true,
        warning: false,
        deleteId: null
      }
    case LOAD_PAGE:
      return {...state, modal: false, loaded: false}
    case DELETE_POPUP:
      return {...state, warning: true, deleteId: action.deleteId}
    case DELETE_CANCEL:
      return {...state, warning: false, deleteId: null}
    default:
      return state
  }
}

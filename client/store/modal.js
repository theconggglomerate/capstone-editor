import Axios from 'axios'

//Action Types

const TURN_ON_MODAL = 'MODAL_ON'
const TURN_OFF_MODAL = 'MODAL_OFF'

// Action Creators

export const getModal = id => ({
  type: TURN_ON_MODAL,
  id
})
export const turnOffModal = () => ({
  type: TURN_OFF_MODAL
})

//THUNKS

// export const getModal = (id) => async dispatch => {
//     try{
//         const {data: elements} = await Axios.get(`/api/noteNotes/${id}`)
//         dispatch(turnOnModal(elements))
//     }catch(err){next(err)}
// }

//Reducer

const initialState = {modal: false, id: null}

export default (state = initialState, action) => {
  switch (action.type) {
    case TURN_ON_MODAL:
      return {modal: true, id: action.id}
    case TURN_OFF_MODAL:
      return {modal: false, id: null}
    default:
      return state
  }
}

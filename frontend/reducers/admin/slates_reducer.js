// Actions
import { SlateConstants } from 'actions/admin/slate_actions'

const _nullSlates = Object.freeze({
  slatesList: [],
  slate: null,
  slatesFetching: false
})

let slatesList

const SlatesReducer = (state = _nullSlates, action) => {
  switch (action.type) {
    case SlateConstants.RECEIVE_SLATES:
      return { ...state, slatesList: action.slates, slatesFetching: false }
      
    case SlateConstants.RECEIVE_SLATE:
      return { ...state, slatesList: [...state.slatesList, action.slate] }
    
    case SlateConstants.RECEIVE_DELETE_SLATE:
      slatesList = [...state.slatesList]
      let deleteIndex = slatesList.findIndex((slate) => slate.id == action.slateId)
      slatesList.splice(deleteIndex, 1)

      return { ...state, slatesList: slatesList }
      
    case SlateConstants.SET_SLATE:
      return { ...state, slate: action.slate }
      
    case SlateConstants.FETCH_SLATES:
      return { ...state, slatesFetching: true }
      
    case SlateConstants.RESET_SLATES:
      return _nullSlates
    
    case SlateConstants.SLATE_STATUS_UPDATED:
      slatesList = [...state.slatesList]
      let updateIndex = slatesList.findIndex((slate) => slate.id == action.payload.slate_id)
      slatesList[updateIndex].status = action.payload.status
      
      return { ...state, slatesList: slatesList }
      
    default:
      return state
  }
}



export default SlatesReducer
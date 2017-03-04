import { combineReducers } from 'redux'

// Reducers
import SessionReducer from 'reducers/session/session_reducer'
import currentSectionReducer from 'reducers/current_section/current_section_reducer'

const RootReducer = combineReducers({
  session: SessionReducer,
  section: currentSectionReducer
})

export default RootReducer

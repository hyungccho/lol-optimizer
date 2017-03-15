// Actions
import { StatConstants } from 'actions/admin/stat_actions'

const _nullStats = Object.freeze({
  players: [],
  teams: [],
  slates: [],
  params: {
    statType: 'actual',
    gamesBack: -1,
    date: new Date(),
    slateId: 0
  }
})

let newParams

const StatsReducer = (state = _nullStats, action) => {
  switch (action.type) {
    case StatConstants.CHANGE_PARAMS:
      newParams = { ...state.params, [action.key]: action.value }

      return { ...state, params: newParams }
      
    case StatConstants.STATS_RECEIVED:
      return {...state, players: action.stats.players, teams: action.stats.teams }
      
    case StatConstants.RESET_STATS:
      return _nullStats

    default:
      return state
  }
}



export default StatsReducer
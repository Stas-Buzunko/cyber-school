import {
  ON_LOGIN_SUCCESS,
  ON_LOGOUT_SUCCESS,
  ON_STEAM_LOGIN
} from '../../actions/auth-actions'
const authFromStorage = localStorage.getItem('cyber-academy-authenticated')
const authenticated = authFromStorage ? JSON.parse(authFromStorage) : false
const userFromStorage = localStorage.getItem('cyber-academy-user')
const user = userFromStorage ? JSON.parse(userFromStorage) : {}

const initialState = {
  authenticated,
  user
}

export default function authReducer (state = initialState, action) {
  switch (action.type) {
    case ON_LOGIN_SUCCESS:
      return {
        ...state,
        authenticated: true
      }
    case ON_LOGOUT_SUCCESS:
      return {
        ...state,
        authenticated:false,
        user: {}
      }
    case ON_STEAM_LOGIN:
      return {
        ...state,
        user: action.payload
      }
    default:
      return state
  }
}

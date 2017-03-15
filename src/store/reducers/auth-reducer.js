import {
  ON_LOGIN_SUCCESS,
  ON_LOGOUT_SUCCESS
} from '../../actions/auth-actions'
const authFromStorage = localStorage.getItem('cyber-academy-authenticated')
const authenticated = authFromStorage ? JSON.parse(authFromStorage) : false

const initialState = {
  authenticated
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
        authenticated:false
      }
    default:
      return state
  }
}

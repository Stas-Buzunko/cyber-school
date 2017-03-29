export const ON_LOGIN_SUCCESS = 'ON_LOGIN_SUCCESS'
export const ON_LOGOUT_SUCCESS = 'ON_LOGOUT_SUCCESS'
export const ON_STEAM_LOGIN = 'ON_STEAM_LOGIN'

export const onLoginSuccess = () => ({
  type: ON_LOGIN_SUCCESS
})

export const onLogoutSuccess = () => ({
  type: ON_LOGOUT_SUCCESS
})

export const steamLogin = user => ({
  type: ON_STEAM_LOGIN,
  payload: user
})

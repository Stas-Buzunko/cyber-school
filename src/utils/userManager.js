import { createUserManager } from 'redux-oidc'

const userManagerConfig = {
  // client_id: '581912277515-8pqeloei552og7pa13iufb57iug8vu9k.apps.googleusercontent.com',
  // redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
  client_id: 'js',
  response_type: 'token id_token',
  // scope: 'openid profile https://www.googleapis.com/auth/youtube.readonly',
  scope: 'openid profile',
  authority: 'http://steamcommunity.com/openid',
  // silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silent_renew.html`,
  silent_redirect_uri: 'http://localhost:3000',
  redirect_uri: 'http://localhost:3000',
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: true
}

const userManager = createUserManager(userManagerConfig)

export default userManager

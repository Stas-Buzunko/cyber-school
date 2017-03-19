import { createUserManager } from 'redux-oidc'
const key = 'DA083B7B78BC4F2F6690F3A154A1008D'
const userManagerConfig = {
  client_id: 'js',
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
  // response_type: 'token id_token',
  // scope: 'openid profile',
  authority: 'http://steamcommunity.com/openid',
  silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/silent_renew.html`,
  // automaticSilentRenew: true,
  // filterProtocolClaims: true,
  // loadUserInfo: true,
  metadata: {
    issuer: 'https://steamcommunity.com/openid',
    jwks_uri: 'https://steamcommunity.com/openid',
    end_session_endpoint: 'https://steamcommunity.com/openid',
    authorization_endpoint: 'https://steamcommunity.com/openid'
  }
}

const userManager = createUserManager(userManagerConfig)

export default userManager

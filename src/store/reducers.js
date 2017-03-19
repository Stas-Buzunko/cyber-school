import { combineReducers } from 'redux'
import locationReducer from './location'
import authReducer from './reducers/auth-reducer'
import { reducer as form } from 'redux-form'
import { reducer as oidcReducer } from 'redux-oidc'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    auth: authReducer,
    oidc: oidcReducer,
    form,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer

import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/createStore'
import AppContainer from './containers/AppContainer'
import * as firebase from 'firebase'
import { onLoginSuccess, onLogoutSuccess } from './actions/auth-actions'

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAaLFv6zXGP2_GKh_kREsi4PXbf1BtsclQ',
  authDomain: 'cyber-academy.firebaseapp.com',
  databaseURL: 'https://cyber-academy.firebaseio.com',
  storageBucket: 'cyber-academy.appspot.com',
  messagingSenderId: '405616072197'
}

firebase.initializeApp(firebaseConfig)

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.___INITIAL_STATE__
const store = createStore(initialState)

// move to admin route? as it's used only for admins?
// will not work for users now
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.dispatch(onLoginSuccess())
  } else {
    store.dispatch(onLogoutSuccess())
    localStorage.removeItem('authenticated')
  }
})

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <AppContainer store={store} routes={routes} />,
    MOUNT_NODE
  )
}

// ========================================================
// Developer Tools Setup
// ========================================================
if (__DEV__) {
  if (window.devToolsExtension) {
    window.devToolsExtension.open()
  }
}

// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        console.error(error)
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// ========================================================
// Go!
// ========================================================
render()

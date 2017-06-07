import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import firebase from 'firebase'
import { steamLogin, onLogoutSuccess, onLoginSuccess } from '../actions/auth-actions'
import { Router, browserHistory } from 'react-router'
import './style.scss'

class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.array.isRequired,
    store  : PropTypes.object.isRequired
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('logged in')

        this.fetchUser(user.uid)
      } else {
        console.log('not logged in')
        this.clearUser()
      }
    })
  }

  shouldComponentUpdate () {
    return false
  }

  fetchUser (uid) {
    const { store } = this.props
    firebase.database().ref('users/' + uid)
    .on('value', snapshot => {
      let user = snapshot.val()

      if (user !== null) {
        user = { ...snapshot.val(), uid }
        localStorage.setItem('cyber-academy-user', JSON.stringify(user))
        store.dispatch(steamLogin(user))
      } else {
        // admin
        store.dispatch(onLoginSuccess())
      }
    })
  }

  clearUser () {
    const { store } = this.props

    store.dispatch(onLogoutSuccess())
    localStorage.removeItem('authenticated')
    localStorage.removeItem('cyber-academy-user')
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
          <div style={{ height: '100%' }} className= 'appContainer'>
            <Router history={browserHistory} children={routes} />
          </div>
      </Provider>
    )
  }
}

export default AppContainer

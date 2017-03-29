import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import firebase from 'firebase'
import { steamLogin, onLogoutSuccess } from '../actions/auth-actions'

class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('logged in')

        // fetch only users logged in via steam
        if (!user.email) {
          this.fetchUser(user.uid)
        }
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
      const user = snapshot.val()

      if (user !== null) {
        localStorage.setItem('cyber-academy-user', JSON.stringify(user))
        store.dispatch(steamLogin(user))
      }
    })
  }

  clearUser () {
    const { store } = this.props

    store.dispatch(onLogoutSuccess())
    localStorage.removeItem('cyber-academy-user')
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%' }}>
          <Router history={browserHistory} children={routes} />
        </div>
      </Provider>
    )
  }
}

export default AppContainer

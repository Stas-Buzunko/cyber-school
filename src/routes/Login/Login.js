import React, { Component, PropTypes } from 'react'
import { browserHistory } from 'react-router'
import firebase from 'firebase'
import toastr from 'toastr'

class Login extends Component {
  componentWillMount () {
    const { query } = this.props.location

    if (!query.token) {
      browserHistory.push('/')
    }
    // add check if user already logged in
    firebase.auth().signInWithCustomToken(query.token)
    .then(() => {
      browserHistory.push('/')
      toastr.success('You are logged in!')
    })
    .catch(error => {
      const errorMessage = error.message
      browserHistory.push('/')
      toastr.error(errorMessage)
    })
  }

  render () {
    return (
      false
    )
  }
}

Login.propTypes = {
  location: PropTypes.object.isRequired,
  query: PropTypes.object
}

export default Login

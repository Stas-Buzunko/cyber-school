import React, { Component } from 'react'
import firebase from 'firebase'
import { Link, browserHistory } from 'react-router'

class VerifyEmail extends Component {
  constructor (props) {
    super(props)

    this.state = {
      status: false,
      message: '',
      loading: false
    }
  }

  componentDidMount () {
    const { mode, oobCode } = this.props.location.query
    if (mode === 'verifyEmail') {
      this.setState({ loading: true })
      const auth = firebase.auth()
      this.handleVerifyEmail(auth, oobCode)
    }
  }

  handleVerifyEmail (auth, actionCode) {
    // Try to apply the email verification code.
    auth.applyActionCode(actionCode).then(resp => {
      // Email address has been verified.
      this.setState({ status: true, message: 'Email address has been verified.', loading: false })
      const { uid } = auth.currentUser

      firebase.database().ref('/users/' + uid).update({ emailVerified: true }).then(() => {
        browserHistory.push({ pathname: '/' })
      })
    }).catch(error => {
      this.setState({ status: false, message: error.message, loading: false })
    })
  }

  render () {
    const { loading } = this.state
    return (
      <div className='page' style={{ textAlign: 'center' }}>
        { loading && <i className='fa fa-refresh fa-spin fa-4x' aria-hidden='true' />}
        {this.state.message}
      </div>
    )
  }
}

export default VerifyEmail

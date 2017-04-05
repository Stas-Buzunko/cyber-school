import React, { Component, PropTypes } from 'react'
import firebase from 'firebase'
import toastr from 'toastr'
import { browserHistory } from 'react-router'

class EmailInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: ''
    }

    this.addEmail = this.addEmail.bind(this)
  }

  addEmail () {
    const { email } = this.state
    const { id } = this.props

    if (!/^.+@.+\..+$/.test(email)) {
      return toastr.error('Please enter valid email')
    }

    firebase.database().ref('users/' + id).update({ email })
    .then(() => {
      toastr.success('Email has been saved!')
    })
  }

  render () {
    const { email } = this.state

    return (
      <div style={{ textAlign: 'center' }}>
        <h3>Please enter your email for cool stuff. No spam.</h3>
        <input type='text' onChange={e => this.setState({ email: e.target.value })} value={email} />
        <button onClick={this.addEmail}>Save</button>
      </div>
    )
  }
}

EmailInput.propTypes = {
  id: PropTypes.string.isRequired
}

export default EmailInput

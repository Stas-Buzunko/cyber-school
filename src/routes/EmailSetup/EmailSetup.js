import React, { Component, PropTypes } from 'react'
import firebase from 'firebase'
import toastr from 'toastr'
import { updateEmail } from '../../api/auth-api'
import { connect } from 'react-redux'

class EmailInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: props.user.email || ''
    }

    this.addEmail = this.addEmail.bind(this)
  }

  addEmail () {
    const { email } = this.state
    const { uid } = this.props.user

    if (!/^.+@.+\..+$/.test(email)) {
      return toastr.error('Please enter valid email')
    }

    firebase.database().ref('users/' + uid).update({ email, emailVerified: false })
    .then(() =>
      //send to backend
      updateEmail({ uid, email })
      .then(() =>
        // send email confirmation
        firebase.auth().onAuthStateChanged(user => {
          console.log('sending email')
          user.sendEmailVerification()
          // console.log(user)
          toastr.success('Confirmation email has been sent to your e-mail')
        })
      )
    )
  }

  render () {
    const { email } = this.state
    const { emailVerified = false } = this.props.user

    return (
      <div style={{ textAlign: 'center' }}>
        <h3>Please enter your email for cool stuff. No spam.</h3>
        <input type='text' onChange={e => this.setState({ email: e.target.value })} value={email} />
        <button onClick={this.addEmail}>Save</button>
        {email && !emailVerified && <p>Please, confirm your email by using following link sent to your email</p>}
      </div>
    )
  }
}

EmailInput.propTypes = {
  user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(EmailInput)

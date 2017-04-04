import React, { Component, PropTypes } from 'react'
import { PUBLISHABLE_KEY as stripePk } from '../../env'
import { connect } from 'react-redux'
import { pay } from '../../api/payment-api'

class StripeComponent extends Component {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    pay: PropTypes.func.isRequired,
    courseId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired
  }

  componentDidMount () {
    const { amount, description } = this.props
    this.stripe = StripeCheckout.configure({  // eslint-disable-line no-undef
      key: stripePk,
      locale: 'auto',
      name: 'Cyber Academy',
      token: this.receiveToken,
      allowRememberMe: false,
      description: description,
      amount: amount
    })
  }

  onOpenStripe = e => {
    e.preventDefault()
    this.stripe.open()
  }

  receiveToken = token => {
    const { pay, amount, courseId, userId } = this.props
    pay({ token: token.id, amount, courseId, userId })
  }

  render () {
    const { buttonText } = this.props

    return (
      <div className='flex'>
        <button onClick={this.onOpenStripe}>{buttonText}</button>
      </div>
    )
  }
}

const mapDispatchToProps = {
  pay
}

export default connect(
  null,
  mapDispatchToProps
)(StripeComponent)

import React, { Component, PropTypes } from 'react'
import { PUBLISHABLE_KEY as stripePk } from '../../env'

export default class StripeComponent extends Component {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    pay: PropTypes.func.isRequired
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

  onOpenStripe = (e) => {
    e.preventDefault()
    this.stripe.open()
  }

  receiveToken = (token) => {
    const { pay, amount } = this.props
    pay({ token: token.id, amount })
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

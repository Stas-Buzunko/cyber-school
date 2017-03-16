import { connect } from 'react-redux'
import StripeComponent from '../components/StripeComponent'
import { pay } from '../api/payment-api'

const mapDispatchToProps = {
  pay
}

export default connect(
  null,
  mapDispatchToProps
)(StripeComponent)

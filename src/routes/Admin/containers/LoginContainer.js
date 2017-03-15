import { connect } from 'react-redux'
import Login from '../components/Login'
import { login } from '../../../api/auth-api'

const mapStateToProps = state => ({
  auth: state.auth
})

const mapDispatchToProps = {
  onLoginSubmit: login
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)

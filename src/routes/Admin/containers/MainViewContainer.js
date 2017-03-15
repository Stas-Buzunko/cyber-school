import { connect } from 'react-redux'
import MainView from '../components/MainView'

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(MainView)

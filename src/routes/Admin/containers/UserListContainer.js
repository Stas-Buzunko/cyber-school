import { connect } from 'react-redux'
import UserList from '../components/UserList'

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(UserList)

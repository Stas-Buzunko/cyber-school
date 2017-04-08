import { connect } from 'react-redux'
import UserCoursesList from '../components/UserCoursesList'

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(UserCoursesList)

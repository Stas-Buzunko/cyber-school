import { connect } from 'react-redux'
import userCoursesList from '../components/userCoursesList'

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(userCoursesList)

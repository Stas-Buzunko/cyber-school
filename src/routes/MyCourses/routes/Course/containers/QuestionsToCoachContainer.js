import { connect } from 'react-redux'
import QuestionsToCoach from '../components/QuestionsToCoach'

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(QuestionsToCoach)

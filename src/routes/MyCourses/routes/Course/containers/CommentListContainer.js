import { connect } from 'react-redux'
import CommentList from '../components/CommentList'

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(CommentList)

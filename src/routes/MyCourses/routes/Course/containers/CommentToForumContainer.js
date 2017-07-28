import { connect } from 'react-redux'
import CommentToForum from '../components/CommentToForum'

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(CommentToForum)

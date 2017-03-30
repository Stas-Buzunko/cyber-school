import React, { Component } from 'react'
import toastr from 'toastr'
import firebase from 'firebase'
import { connectModal, show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import CommentPopupComponent from './CommentPopupComponent'

class CommentList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      comment: '',
      isCommentForLesson: '',
      comments: []
}
  this.renderCommentList = this.renderCommentList.bind(this)
  }
  //
  componentWillMount () {
    const { comments } = this.props
    this.setState({comments})
  }

  componentWillReceiveProps (nextProps) {
    this.props.comments !== nextProps.comments && this.setState({comments:nextProps.comments})
  }

  renderCommentList () {
    const { comments } = this.state
    return comments.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-10 col-md-6'>
            <div> {item} </div>
          </div>
        </div>
      </li>
    )
  }
  render () {

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
            <label className='control-label col-xs-2'>Comments:</label>
            <ul className='list-unstyled'>
              {this.renderCommentList()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

CommentList.propTypes = {
  openModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  isCommentForLesson: React.PropTypes.bool,
  comments: React.PropTypes.array
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}

export default connect(
  null,
  mapDispatchToProps
)(CommentList)

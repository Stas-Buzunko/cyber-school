import React, { Component } from 'react'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import firebase from 'firebase'
import CommentPopupComponent from './CommentPopupComponent'
import toastr from 'toastr'

class CommentList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      comment: '',
      isCommentForLesson: '',
      comments: []
    }
    this.renderCommentList = this.renderCommentList.bind(this)
    this.renderChildrenList = this.renderChildrenList.bind(this)
  }

  componentWillMount () {
    const { comments } = this.props
    this.setState({ comments })
  }

  componentWillReceiveProps (nextProps) {
    this.props.comments !== nextProps.comments && this.setState({ comments:nextProps.comments })
  }

  renderCommentPopup (isRespond, item) {
    return (
      <div>
        <button
          type='button'
          className='btn btn-success lg'
          onClick={(e) => {
            e.preventDefault()
            this.props.openModal('comment', { isRespond, item })
          }}>Reply
        </button>
      </div>
    )
  }

  saveRespond = (respond, isRespond, item) => {
    const { courseId } = this.props
    firebase.database().ref('courses/' + courseId)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const comments = object.comments
        this.setState({ comments })
      }
    })
    .then(() => {
      const { comments } = this.state
      const newCommentChildrenArray = [
        ...item.children,
        respond
      ]
      const indexItemToRemove = comments.findIndex(comment => item.name === comment.name)

      const newComment = {
        text : comments[indexItemToRemove].text,
        children: newCommentChildrenArray
      }

      const newArray = [
        ...comments.slice(0, indexItemToRemove),
        ...comments.slice(indexItemToRemove + 1),
        newComment
      ]

      this.setState({ comments: newArray })
    })
    .then(() => {
      const { comments } = this.state
      firebase.database().ref('courses/' + courseId).update({ comments })
    })
    .then(() => {
      this.props.hideModal('comment')
      toastr.success('Your comment saved!')
    })
  }

  renderChildrenList (item) {
    return item.children.map((child, i) =>
      <div key={i}> {child} </div>)
  }

  renderCommentList () {
    const { comments } = this.state
    const { isRespond } = true
    return comments.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-10' style={{ padding: '15px' }} >
          <div className='col-xs-10 col-md-4'>
            <div> {item.text} </div>
          </div>
          <div className='col-xs-6 col-md-4'>
            {this.renderCommentPopup(isRespond, item) }
            <CommentPopupComponent
              saveComment={this.saveRespond} />
          </div>
        </div>
        <div className='col-xs-12 col-md-10' style={{ padding: '15px' }} >
          <div className='col-xs-12 col-md-2'>
          </div>
          <div className='col-xs-10 col-md-8'>
            {this.renderChildrenList(item)}
          </div>
        </div>
      </li>
    )
  }
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-12' style={{ padding: '15px' }}>
            <label className='control-label col-xs-2 col-md-2'>Comments:</label>
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
  comments: React.PropTypes.array,
  openModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  courseId: React.PropTypes.string
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}

export default connect(
  null,
  mapDispatchToProps
)(CommentList)

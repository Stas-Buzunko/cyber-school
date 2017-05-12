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
      comments: [],
      user: {},
      userLoaded: false

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
    const buttonName = isRespond ? 'Reply' : 'Add Comment'
    return (
      <div>
        <button
          type='button'
          className='btn btn-success lg'
          onClick={(e) => {
            e.preventDefault()
            this.props.openModal('comment', { isRespond, item })
          }}>{buttonName}
        </button>
        <CommentPopupComponent
          saveComment={this.saveComment} />
      </div>
    )
  }

  saveComment = (comment, isRespond, item) => {
    const { user } = this.props.auth
    this.setState({
      comments: []
    })
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
      const { comments = [] } = this.state
      if (!isRespond) {
        const commentStructure = {
          text: comment,
          children:[],
          uid: user.uid,
          displayName: user.displayName,
          avatar: user.avatar
        }
        const newComments = [ ...comments, commentStructure ]
        this.setState({ comments: newComments })
      } else {
        const respond = { comment, uid: user.uid, displayName: user.displayName, avatar: user.avatar }
        if (!item.children) {
          item.children = []
        }
        const newCommentChildrenArray = [
          ...item.children,
          respond
        ]
        const indexItemToRemove = comments.findIndex(comment => item.text === comment.text)
        const newComment = {
          text : comments[indexItemToRemove].text,
          children: newCommentChildrenArray
        }
        const newArray = [
          ...comments.slice(0, indexItemToRemove),
          newComment,
          ...comments.slice(indexItemToRemove + 1)
        ]
        this.setState({ comments: newArray })
      }
    })
      .then(() => {
        const { comments } = this.state
        firebase.database().ref('courses/' + courseId).update({ comments })
      })
      .then(() => {
        this.props.hideModal('comment')
        if (!isRespond) {
          toastr.success('Your comment saved!')
        } else {
          toastr.success('Your respond saved!')
        }
      })
  }

  renderChildrenList (item) {
    return item.children.map((child, i) =>
      <div key={i} className='col-xs-12 col-md-12'>
        <div className='col-xs-12 col-md-4'>
          <div className='col-xs-12 col-md-4'>{child.displayName}</div>
          <div className='col-xs-12 col-md-4'><img style={{borderRadius:'50%'}} src={child.avatar} /> </div>
        </div>
        <div className='col-xs-12 col-md-3'>{child.comment} </div>
      </div>)
  }

  renderCommentList () {
    const { comments = [] } = this.state
    const isRespond = true
    return comments.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-10 col-md-3'>
            <div className='col-xs-10 col-md-3'>{item.displayName}</div>
            <div className='col-xs-10 col-md-3'><img style={{ borderRadius:'50%' }} src={item.avatar} /> </div>
          </div>
          <div className='col-xs-10 col-md-3' style={{ borderRadius:'50%' }}>{item.text} </div>
          <div className='col-xs-6 col-md-4'>
            {this.renderCommentPopup(isRespond, item) }
          </div>
        </div>

        { item.children && <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-12 col-md-2'>
          </div>
          <div className='col-xs-10 col-md-8'>
            {this.renderChildrenList(item)}
          </div>
        </div>}
      </li>
  )
  }
  render () {
    const isRespond = false
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-12' style={{ padding: '15px' }}>
            <label className='control-label col-xs-2 col-md-2'>Comments:</label>
            <ul className='list-unstyled'>
              {this.renderCommentPopup(isRespond, {}) }
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
  courseId: React.PropTypes.string,
  auth: React.PropTypes.object
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}

export default connect(
  null,
  mapDispatchToProps
)(CommentList)

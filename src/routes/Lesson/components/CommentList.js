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
      lesson: {}
    }
    this.renderCommentList = this.renderCommentList.bind(this)
    this.renderCommentList = this.renderCommentList.bind(this)
    this.renderChildrenList = this.renderChildrenList.bind(this)
  }

  // componentWillMount () {
  //   const { comments } = this.props
  //   this.setState({ comments })
  //     console.log('comments',comments)
  // }

  componentWillReceiveProps (nextProps) {
    this.props.comments !== nextProps.comments && this.setState({ comments: nextProps.comments })
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
    this.setState({
      comments: []
    })
    if (!isRespond) {
      const { courseId } = this.props
      console.log(courseId)
      console.log('saveComment')
      firebase.database().ref('courses/' + courseId)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        if (object !== null) {
          const comments = object.comments
          this.setState({ comments })
          console.log('comments', comments)

        }
      })
      .then(() => {
        const { comments } = this.state
        const commentStructure = {
          text: comment,
          children:[] }
  console.log('commentStructure', commentStructure)
        const newComments = [ ...comments, commentStructure ]
        this.setState({ comments: newComments })
          console.log('comments', newComments)
      })
        .then(() => {
          const { comments } = this.state
          firebase.database().ref('courses/' + courseId).update({ comments })
        })
        .then(() => {
          this.props.hideModal('comment')
          toastr.success('Your comment saved!')
        })
    } else {
      const respond = comment
      console.log('saveRespond')
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
        console.log('newCommentChildrenArray', newCommentChildrenArray)
        console.log('item', item)
        const indexItemToRemove = comments.findIndex(comment => item.text === comment.text)
        console.log('indexItemToRemove', indexItemToRemove)

        const newComment = {
          text : comments[indexItemToRemove].text,
          children: newCommentChildrenArray
        }
        console.log('newComment',newComment)
        const newArray = [
          ...comments.slice(0, indexItemToRemove),
          ...comments.slice(indexItemToRemove + 1),
          newComment
        ]
        console.log('newArray',newArray)
        this.setState({ comments: newArray })
      })
      .then(() => {
        const { comments } = this.state
        firebase.database().ref('courses/' + courseId).update({ comments })
      })
      .then(() => {
        this.props.hideModal('comment')
        toastr.success('Your respond saved!')
      })
    }
  }

  renderChildrenList (item) {
    return item.children.map((child, i) =>
      <div key={i}>
        {child}
      </div>)
  }
  printCommentList () {
    const comments = this.state.comments || []
        comments.map((item) =>
        console.log(item))
  }
  renderCommentList () {
    const comments = this.state.comments || []
    console.log('renderCommentList', comments)
    // const comments2 = [{text : "eqdvsgdbfv"}, {text: '222'}]
    const isRespond = true
    return comments.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-10' style={{ padding: '15px' }} >
          <div className='col-xs-10 col-md-4'>
            <div> {item.text} </div>
          </div>
          <div className='col-xs-6 col-md-4'>
            {this.renderCommentPopup(isRespond, item) }
          </div>
        </div>
        { item.children && <div className='col-xs-12 col-md-10' style={{ padding: '15px' }} >
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
                  {this.printCommentList()}
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

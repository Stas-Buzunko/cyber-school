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
      subSections: {},
      subSectionsLoaded: false,
      lesson: {},
      lessonLoaded: false,
      comments: [],
      hasLessonComments: false
    }
    this.saveComment = this.saveComment.bind(this)
    this.renderCommentList = this.renderCommentList.bind(this)
  }

  componentDidMount () {
    this.fetchItem()
  }
  fetchItem () {
    const { lessonId, courseId } = this.props
    this.setState({
      forumSections: [],
      sectionsLoaded: false
    })
    firebase.database().ref('forumSections/' + courseId)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const forumSection = object
        const keys = Object.keys(forumSection.subSections)
        const hasLessonComments = keys.includes(lessonId)
        this.setState({
          hasLessonComments,
          subSection: forumSection.subSections[`${lessonId}`],
          sectionLoaded: true })
        this.fetchLesson()
      } else {
        this.setState({ sectionLoaded: true })
      }
    })
  }
  fetchLesson () {
    const { lessonId } = this.props
    const { hasLessonComments } = this.state

    this.setState({
      lesson: [],
      lessonLoaded: false
    })
    if (hasLessonComments) {
      firebase.database().ref('lessons/' + lessonId)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        const lesson = { name: object.name, lessonId: lessonId }
        this.setState({
          lesson,
          lessonLoaded: true
        })
      })
    }
  }

  renderCommentPopup (isRespond, item, lessonId) {
    const buttonName = isRespond ? 'Reply' : 'Add Comment'
    return (
      <div>
        <button
          type='button'
          className='btn btn-success lg'
          onClick={(e) => {
            e.preventDefault()
            this.props.openModal('comment', { isRespond, item, lessonId })
          }}>{buttonName}
        </button>
        <CommentPopupComponent
          saveComment={this.saveComment} />
      </div>
    )
  }

  saveComment = (comment, isRespond, item) => {
    const { user } = this.props.auth
    const { lessonId, courseId } = this.props
    this.setState({
      comments: []
    })
    firebase.database().ref('forumSections/' + courseId)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const subSections = object.subSections
        if (subSections) {
          const comments = object.subSections[`${lessonId}`] || []
          this.setState({ comments, subSections })
        }
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
        const respond = comment
        if (!item.children) {
          item.children = []
        }
        const newCommentChildrenArray = [
          ...item.children,
          respond
        ]
        const indexItem = comments.findIndex(comment => item.text === comment.text)
        const newComment = {
          text : comments[indexItem].text,
          children: newCommentChildrenArray,
          uid: user.uid,
          displayName: user.displayName,
          avatar: user.avatar
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
      const { comments, subSections } = this.state
      const { lessonId } = this.props
      const newSubSections = !!subSections ? subSections : {}
      newSubSections[`${lessonId}`] = comments
      this.setState({ subSection: comments, hasLessonComments: true })
      firebase.database().ref('forumSections/' + courseId).update({ subSections: newSubSections })
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
          <div className='col-xs-12 col-md-4'>{item.displayName}</div>
          <div className='col-xs-12 col-md-4'><img style={{ borderRadius:'50%' }} src={item.avatar} /> </div>
        </div>
        <div className='col-xs-12 col-md-3'>{child} </div>
      </div>)
  }

  renderCommentList () {
    const isRespond = true
    const { subSection, lesson } = this.state
    return subSection.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-10 col-md-3'>
            <div className='col-xs-10 col-md-3'>{item.displayName}</div>
            <div className='col-xs-10 col-md-3'><img style={{ borderRadius:'50%' }} src={item.avatar} /> </div>
          </div>
          <div className='col-xs-10 col-md-3' style={{ borderRadius:'50%' }}>{item.text} </div>
          <div className='col-xs-6 col-md-4'>
            {this.renderCommentPopup(isRespond, item, lesson.lessonId) }
          </div>
        </div>
        {!!item.children && <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
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
    const { hasLessonComments, lesson } = this.state
    const isRespond = false
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-12' style={{ padding: '15px' }}>
            <label className='control-label col-xs-2 col-md-2'>{lesson.name}</label>
            <label className='control-label col-xs-2 col-md-12'>Lesson comments: </label>
            <ul className='list-unstyled'>
              {this.renderCommentPopup(isRespond, {}, lesson.lessonId) }
              {!!hasLessonComments && <div>
                {this.renderCommentList()}
              </div>}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

CommentList.propTypes = {
  openModal: React.PropTypes.func,
  lessonId:  React.PropTypes.string,
  hideModal: React.PropTypes.func,
  user: React.PropTypes.object,
  auth: React.PropTypes.object,
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

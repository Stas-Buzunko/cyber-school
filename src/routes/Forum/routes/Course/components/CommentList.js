import React, { Component } from 'react'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import firebase from 'firebase'
import CommentPopupComponent from './CommentPopupComponent'

class CommentList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      generalQuestions: [],
      generalQuestionsLoaded: false,
      subSections: {},
      subSectionsLoaded: false,
      lessons: [],
      lessonsLoaded: false,
      comments: []
    }
    this.saveComment = this.saveComment.bind(this)
    this.renderCommentList = this.renderCommentList.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.props.subSections !== nextProps.subSections && this.fetchLessons(nextProps.subSections)
  }

  fetchLessons (subSections) {
    this.setState({
      lessons: [],
      lessonsLoaded: false
    })

    const keys = Object.keys(subSections)

    const promises = keys.map(key => {
      return firebase.database().ref('lessons/' + key)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        const lesson = { name: object.name, lessonId: key }
        return (lesson)
      })
    })
    Promise.all(promises).then(result => {
      this.setState({
        lessons: result,
        lessonsLoaded: true
      })
    })
  }

  renderCommentPopup (isRespond, item, type, lessonId) {
    const buttonName = isRespond ? 'Reply' : 'Add Comment'
    return (
      <div>
        <button
          type='button'
          className='btn btn-success lg'
          onClick={(e) => {
            e.preventDefault()
            this.props.openModal('comment', { isRespond, item, type, lessonId })
          }}>{buttonName}
        </button>
        <CommentPopupComponent
          saveComment={this.saveComment} />
      </div>
    )
  }

  saveComment = (comment, isRespond, item, type, lessonId) => {
    this.props.saveComment(comment, isRespond, item, type, lessonId)
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

  renderCommentList (array, type, lessonId) {
    const isRespond = true
    return array.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-10 col-md-3'>
            <div className='col-xs-10 col-md-3'>{item.displayName}</div>
            <div className='col-xs-10 col-md-3'><img style={{ borderRadius:'50%' }} src={item.avatar} /> </div>
          </div>
          <div className='col-xs-10 col-md-3' style={{ borderRadius:'50%' }}>{item.text} </div>
          <div className='col-xs-6 col-md-4'>
            {this.renderCommentPopup(isRespond, item, type, lessonId) }
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

  renderLessonCommentList (subSections, isRespond, type) {
    const { lessons = [] } = this.state
    console.log(subSections)
    let lessonId, array, item
    return lessons.map((lesson, i) =>
      <div key={i}>
        <label className='control-label col-xs-2 col-md-12 text-left'>{lesson.name}</label>
        {this.renderCommentPopup(isRespond, item = {}, type, lessonId = lesson.lessonId) }
        {this.renderCommentList(subSections[`${lesson.lessonId}`], type, lessonId = lesson.lessonId)}
      </div>
    )
  }

  render () {
    const { generalQuestions = [], subSections = {} } = this.props
    const isRespond = false
    let lessonId, array, item, type
    return (
      <div className='container'>
        <div className='row'>
          {!!generalQuestions.length &&
            <div className='col-xs-12 col-md-12' style={{ padding: '15px' }}>
              <label className='control-label col-xs-2 col-md-2'>General comments:</label>
              <ul className='list-unstyled'>
                {this.renderCommentPopup(isRespond, item = {}, type = 'course', lessonId = '') }
                {this.renderCommentList(generalQuestions, type, lessonId = '')}
              </ul>
            </div>
          }
          {!!subSections && <div className='col-xs-12 col-md-12' style={{ padding: '15px' }}>
            <label className='control-label col-xs-2 col-md-2'>Lesson comments:</label>
            <ul className='list-unstyled'>
              {this.renderLessonCommentList(subSections, isRespond, type = 'lesson')}
            </ul>
          </div>
        }
      </div>
    </div>
  )
}
}

CommentList.propTypes = {
  openModal: React.PropTypes.func,
  type: React.PropTypes.string,
  subSections: React.PropTypes.object,
  generalQuestions: React.PropTypes.array,
  saveComment: React.PropTypes.func
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}

export default connect(
  null,
  mapDispatchToProps
)(CommentList)

import React, { Component } from 'react'
import toastr from 'toastr'
import firebase from 'firebase'
import { connectModal, show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import LessonPopupComponent from './LessonPopupComponent'

class LessonsList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      lessons: [],
      lessonsIds: [],
      lessonsLoaded: false
    }
  }

  componentWillMount () {
    const lessonsIds = this.props.lessonsIds
    this.fetchItems(lessonsIds)

  }

  componentWillReceiveProps (nextProps) {
    this.props.lessonsIds !== nextProps.lessonsIds && this.fetchItems(nextProps.lessonsIds)
  }

  fetchItems (lessonsIds) {
    this.setState({
      lessons: [],
      lessonsLoaded: false
    })
    let newLessons = []
    lessonsIds.forEach(id => {
      firebase.database().ref('lessons/' + id)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        if (object !== null) {
          const lessonFromId = object
          lessonFromId.id = id
          newLessons.push(lessonFromId)
          this.setState({ lessons: newLessons, lessonsLoaded: true })
        } else {
          this.setState({ coursesLoaded: true })
        }
      })
    })
  }

  renderLessonPopup (e, item) {
    e.preventDefault()
    this.props.openModal('lesson', { item })
  }

  editLesson = (lesson) => {
    const lessonKey = lesson.id
    firebase.database().ref('lessons/' + lessonKey).update({
      name:lesson.name,
      description: lesson.description,
      length:  lesson.length,
      imageUrl:  lesson.imageUrl,
      videoUrl: lesson.videoUrl,
      isFree: lesson.isFree,
      testId:  lesson.testId,
      comments: lesson.comments
    })
    .then(() => {
      const { lessons } = this.state
      console.log(lessons)
      lessons.map(item => {
        if (lessonKey !== item.id) {
          return false
        } else {

          // this.fetchItems(this.props.lessonsIds)
          this.setState({item: lesson
            // name : lesson.name,
            // description : lesson.description,
            // length : lesson.length,
            // imageUrl : lesson.imageUrl,
            // videoUrl : lesson.videoUrl,
            // isFree : lesson.isFree,
            // testId : lesson.testId,
            // comments : lesson.comments,
          })

          // item.name = lesson.name
          // item.description = lesson.description
          // item.length = lesson.length
          // item.imageUrl = lesson.imageUrl
          // item.videoUrl = lesson.videoUrl
          // item.isFree = lesson.isFree
          // item.testId = lesson.testId
          // item.comments = lesson.comments
        }
      })
      this.props.hideModal('lesson')
      toastr.success('Your lesson saved!')
    })
  }

  renderLessonsList () {
    const { lessons } = this.state
    const isNewLesson = this.props.isNewLesson
    return lessons.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-12 col-md-8'>

            <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Name:</label>
              <div> {item.name}</div>
            </div>
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Description:</label>
              <div> {item.description}</div>
            </div>}
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Length:</label>
              <div> {item.length}</div>
            </div>}
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>ImageUrl:</label>
              <div> {item.imageUrl}</div>
            </div>}
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>VideoUrl:</label>
              <div> {item.videoUrl}</div>
            </div>}
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>IsFree:</label>
              <div> {item.isFree}</div>
            </div>}
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>TestId:</label>
              <div> {item.testId}</div>
            </div>}
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Comments:</label>
              <div> {item.comments}</div>
            </div>}
          </div>
          { !isNewLesson && <div className='col-xs-12 col-md-4'>
            <button
              type='button'
              className='btn btn-primary lg'
              onClick={(e) => {
                this.renderLessonPopup(e, item)
              }}
              >Edit lesson
            </button>
            <LessonPopupComponent
              isNewLesson={false}
              saveLesson={this.editLesson}

              />
          </div> }
        </div>
      </li>
    )
  }
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              {this.renderLessonsList()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

LessonsList.propTypes = {
  openModal: React.PropTypes.func,
  lessonsIds: React.PropTypes.array,
  isNewLesson: React.PropTypes.bool,
  hideModal: React.PropTypes.func
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}

export default connect(
  null,
  mapDispatchToProps
)(LessonsList)

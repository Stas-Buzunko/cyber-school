import React, { Component } from 'react'
import firebase from 'firebase'
import CommentList from '../containers/CommentListContainer'
import VideoPlayer from '../../../../../../Utils/VideoPlayer'
import './MainView.scss'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lesson: [],
      lessonLoaded: false
    }
    this.addVideoId = this.addVideoId.bind(this)
  }

  componentWillMount () {
    const { lessonId } = this.props.params
    this.fetchItems(lessonId)
  }

  fetchItems (id) {
    this.setState({
      lesson: [],
      lessonLoaded: false
    })
    firebase.database().ref('lessons/' + id)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const lesson = object
        lesson.id = id
        this.setState({ lesson, lessonLoaded: true })
      } else {
        this.setState({ lessonLoaded: true })
      }
    })
  }

  addLessonIdIfUnique (uniqueWatchedLessonsIds = [], lessonId) {
    const isLessonInWatchedLessonsIds = uniqueWatchedLessonsIds.findIndex(id => id === lessonId)
    if (isLessonInWatchedLessonsIds === -1) {
      return ([
        ...uniqueWatchedLessonsIds,
        lessonId
      ])
    } else {
      return uniqueWatchedLessonsIds
    }
  }

  addVideoId (isEnded) {
    const { lessonId = '', courseId = '' } = this.props.params
    const { userCourses, uid } = this.props.auth.user
    const courseFromUser = userCourses.find((item, i) => item.courseId === courseId)
    if (isEnded) {
      const { watchedLessonsIds = [], uniqueWatchedLessonsIds = [] } = courseFromUser
      const newUniqueWatchedLessonsIds = this.addLessonIdIfUnique(uniqueWatchedLessonsIds, lessonId)
      const newWatchedLessonsIds = [
        ...watchedLessonsIds,
        lessonId
      ]
      const newCourseFromUser = {
        ...courseFromUser,
        watchedLessonsIds : newWatchedLessonsIds,
        uniqueWatchedLessonsIds : newUniqueWatchedLessonsIds
      }
      this.setState({ newCourseFromUser })
    } else {
      const { startedLessonsIds = [] } = courseFromUser
      const newStartedLessonsIds = [
        ...startedLessonsIds,
        lessonId
      ]
      const newCourseFromUser = {
        ...courseFromUser,
        startedLessonsIds : newStartedLessonsIds
      }
      this.setState({ newCourseFromUser })
    }

    const { newCourseFromUser } = this.state
    const indexItemToRemove = userCourses.findIndex(course => course.courseId === courseId)
    const newUserCourses = [
      ...userCourses.slice(0, indexItemToRemove),
      newCourseFromUser,
      ...userCourses.slice(indexItemToRemove + 1)
    ]
    firebase.database().ref('users/' + uid).update({ userCourses: newUserCourses })
  }

  renderVideo () {
    const { lesson = {} } = this.state
    if (lesson.videoUrl) {
      return (
        <div>
          <VideoPlayer
            url={lesson.videoUrl}
            addVideoId={this.addVideoId}

          />
        </div>
      )
    }
  }

  renderLesson () {
    const { lesson = {} } = this.state
    return (
      <div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Name:</label>
            <div> {lesson.name}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Video:</label>
            {this.renderVideo()}
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Description:</label>
            <div> {lesson.description}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Length:</label>
            <div> {lesson.length}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>ImageUrl:</label>
            <img src={lesson.imageUrl} width='150px' height='100px' />
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>VideoUrl:</label>
            <div> {lesson.videoUrl}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>IsFree:</label>
            <div> {lesson.isFree}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>TestId:</label>
            <div> {lesson.testId}</div>
          </div>
      </div>
    )
  }

  render () {
    const { params } = this.props
    return (
      <div className='container container-course text-center'>
        <div className='row'>
          <div className='col-xs-12 col-md-12' >
              {this.renderLesson()}
          </div>

            <CommentList
              lessonId={params.lessonId}
              courseId={params.courseId}
            />
              </div>
      </div>
    )
  }
}
MainView.propTypes = {
  params: React.PropTypes.object,
  auth: React.PropTypes.object,
  user: React.PropTypes.object
}

export default MainView

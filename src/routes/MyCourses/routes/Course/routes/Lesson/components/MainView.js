import React, { Component } from 'react'
import firebase from 'firebase'
import VideoPlayer from './VideoPlayer'
import './MainView.scss'
import CommentToForum from '../containers/CommentToForumContainer'
import QuestionsToCoach from '../containers/QuestionsToCoachContainer'
import { Link, browserHistory } from 'react-router'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lesson: [],
      lessonLoaded: false,
      course: {},
      courseLoaded: false,
      showComments: false,
      buttonName: 'Show Comments',
      buttonTaskName: 'Show Practice Task',
      userCourses: [],
      set: new Set()
    }
    this.addVideoId = this.addVideoId.bind(this)
  }

  componentWillMount () {
    const { params } = this.props
    this.fetchItem(params.courseId)
    this.fetchLesson(params.lessonId)
  }

  fetchLesson (id) {
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

  fetchItem (id) {
    this.setState({
      course: {},
      courseLoaded: false
    })

    firebase.database().ref('courses/' + id)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const course = { ...snapshot.val(), id }
        const { sections } = course
        const newSectionsLessons = sections.map(section => {
          if (section.lessonsIds) {
            const promisesLessons = section.lessonsIds.map(id =>
            firebase.database().ref('lessons/' + id)
            .once('value')
            .then(snapshot2 => ({ ...snapshot2.val(), id }))
          )
            return Promise.all(promisesLessons).then(lessons => {
              section = { ...section, lessons }
              return (section)
            })
          }
        })
        Promise.all(newSectionsLessons).then(result => {
          const { params } = this.props
          const newSections = result.filter((item) => item.sectionNumber !== 0)
          const section = newSections.filter((item) => item.lessonsIds.includes(params.lessonId))
          const testId = section[0].testsIds[0]
          this.setState({
            sections: result,
            course,
            testId,
            courseLoaded: true
          })
          const { sections } = this.state
          const newSectionsTests = sections.map(section => {
            const promisesTests = section.testsIds.map(id =>
              firebase.database().ref('tests/' + id)
              .once('value')
              .then(snapshot3 => ({ ...snapshot3.val(), id }))
            )
            return Promise.all(promisesTests).then(tests => {
              section = { ...section, tests }
              return (section)
            })
          })
          Promise.all(newSectionsTests).then(result => {
            this.setState({
              sections: result,
              testsLoaded: true
            })
          })
        })
      } else {
        this.setState({ courseLoaded: true })
      }
    })
  }

  isPassed (id, type) {
    const { params } = this.props
    const { userCourses } = this.props.auth.user
    const courseFromUser = userCourses.find(item => item.courseId === params.courseId)
    const { uniqueWatchedLessonsIds = [], passedTestIds = [] } = courseFromUser
    const array = (type === 'lesson') ? uniqueWatchedLessonsIds : passedTestIds
    const passed = array.findIndex(item => item === id)
    if (passed === -1) {
      return false
    } else {
      return true
    }
  }

  renderLessonsList (lessons = []) {
    const { location } = this.props
    const isBonusLesson = (item) => {
      return (item.isBonus === true)
    }
    const newPath = `${location.pathname.substring(0, location.pathname.length - 20)}`
    return lessons.map((item, i) =>
      <div key={i}
        onClick={() => { this.fetchLesson(item.id) }}>
        <Link to={{
          pathname: `${newPath}${item.id}` }}>{item.name}
        </Link>
        <input
          type='checkbox'
          checked={this.isPassed(item.id, 'lesson')} />
        {isBonusLesson(item) && <div> Bonus </div>}
      </div>
  )
  }

  renderTestsList (tests = []) {
    const { location } = this.props
    return tests.map((item, i) =>
      <div key={i}>
        <Link to={{
          pathname: `${location.pathname.substring(0, location.pathname.length - 27)}test/${item.id}` }}>{item.name}
        </Link>
        {/* <label className='checkbox checkbox-info checkbox-circle'> */}
        <input
          type='checkbox'
          checked={this.isPassed(item.id, 'test')}
        />
        {/* </label> */}
      </div>
  )
  }

  renderSectionsList () {
    const { sections = [], set } = this.state
    const newSections = sections.filter((item) => item.sectionNumber !== 0)
    let newSet = new Set()
    return (
      <ul className='list-unstyled'>
        {newSections.map((item, i) =>
          <div key={i}>
            <div
              onClick={() => {
                if (set.has(i)) {
                  newSet.delete(i)
                } else {
                  newSet.add(i)
                }
                this.setState({ set: newSet })
              }
              }
              >{item.name}</div>
            <div>
              { set.has(i) && this.renderLessonsList(item.lessons)}
              { set.has(i) && this.renderTestsList(item.tests)}
            </div>
          </div>
          )}
      </ul>
    )
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
    const { lesson = {}, stopVideo } = this.state
    if (lesson.videoUrl) {
      return (
        <div>
          <VideoPlayer
            url={lesson.videoUrl}
            addVideoId={this.addVideoId}
            stopVideo={stopVideo}
          />
        </div>
      )
    }
  }

  buttonClick () {
    const { showComments, buttonName } = this.state
    const newButtonName = (buttonName === 'Show Comments') ? 'Hide Comments' : 'Show Comments'
    this.setState({ showComments: !showComments, buttonName: newButtonName })
  }

  renderShowCommentsButton () {
    const { buttonName } = this.state
    return (
      <div>
        <button
          type='button'
          className='btn btn-success lg'
          style={{ width:'30%', margin: '15px' }}
          onClick={() => this.buttonClick()}
          >{buttonName}
        </button>
      </div>
    )
  }

  buttonClickTask () {
    const { showTask, buttonTaskName } = this.state
    const newButtonTaskName = (buttonTaskName === 'Show Task') ? 'Hide Task' : 'Show Task'
    this.setState({ showTask: !showTask, buttonTaskName: newButtonTaskName })
  }

  renderShowTaskButton () {
    const { buttonTaskName } = this.state
    return (
      <div>
        <button
          type='button'
          className='btn btn-success lg'
          style={{ width:'30%', margin: '15px' }}
          onClick={() => this.buttonClickTask()}
          >{buttonTaskName}
        </button>
      </div>
    )
  }

  renderTestButton () {
    const { testId } = this.state
    const { location } = this.props
    return (
      <div>
        <button
          type='button'
          className='btn btn-success lg'
          style={{ width:'30%', margin: '15px' }}
          onClick={() => {
            browserHistory.push({
              pathname: `${location.pathname.substring(0, location.pathname.length - 27)}test/${testId}`
            })
          }}
          >Пройти тест
        </button>
      </div>
    )
  }

  render () {
    const { course, courseLoaded, showComments, lesson, stopVideo, showTask } = this.state
    const { params } = this.props
    const practiceTask = lesson.task || ''
    if (!courseLoaded) {
      return (<div>Loading...</div>)
    }

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-12'>
            <div className='col-xs3 col-md-3'>
              <div className='chapters'>
                <div> {course.name}</div>
                <ul className='list-unstyled'>
                  {this.renderSectionsList()}
                </ul>
              </div>
            </div>
            <div className='col-xs-9 col-md-9'>
              {/* <div className='progress'> */}
              <div> {this.renderVideo()}</div>
              <button
                type='button'
                className='videoButton'
                onClick={() => { this.setState({ stopVideo: !stopVideo }) }}
                >{lesson.name}
              </button>
            </div>
          </div>
          <div className='col-xs-12 col-md-12'>
            <div className='col-xs-4 col-md-4'>
              <div className='chat'>
                <div>Чат с тренером</div>
                <QuestionsToCoach
                  courseId={params.courseId}
                />
              </div>
            </div>
            <div className='col-xs-8 col-md-8 questions'>
              <div className='questions'>
                {this.renderShowCommentsButton()}
                {showComments && <CommentToForum
                  courseId={params.courseId}
                />}
              </div>
            </div>

            <div className='col-xs-8 col-md-8 task'>
              {this.renderShowTaskButton()}
              {showTask && <div> Hello. I am your practice task: {practiceTask}
              </div>}
            </div>

            <div className='col-xs-8 col-md-8 testButton'>
              <div className='questions'>
                {this.renderTestButton()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
MainView.propTypes = {
  location: React.PropTypes.object,
  params: React.PropTypes.object,
  auth: React.PropTypes.object,
  user: React.PropTypes.object
}

export default MainView

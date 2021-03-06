import React, { Component, PropTypes } from 'react'
import firebase from 'firebase'
import CommentList from '../containers/CommentListContainer'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import './MainView.scss'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      course: {},
      courseLoaded: false,
      lessons: [],
      lessonsLoaded: false,
      showComments: false,
      buttonName: 'Show Comments',
      userCourses: [],
      newWatchLessonId: [],
      nextLessonId: '',
      firstLessonId: ''
    }
  }

  componentWillMount () {
    const { params } = this.props
    this.fetchItem(params.courseId)
  }

  fetchItem (id) {
    this.setState({
      course: {},
      courseLoaded: false,
      lessons: [],
      lessonsLoaded: false
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
          const numberLessonsInCourse = this.countNumberLessonsInCourse(course)
          const nextLessonId = this.countNextLessonId(course)
          this.setState({
            sections: result,
            course,
            courseLoaded: true,
            lessonsLoaded: true,
            numberLessonsInCourse,
            nextLessonId,
            firstLessonId: course.sections[0].lessonsIds[0]
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
    return lessons.map((item, i) =>
    <tr key={i}>
      <td>
        <Link to={{ pathname: `${location.pathname}/lesson/${item.id}` }}>{item.name}</Link>
      </td>
      <td> {item.length} </td>
      <td>
        <div className='col-xs-10 col-md-2'>
          <label className='checkbox checkbox-info checkbox-circle' style={{ paddingBottom: '20px' }}>
            <input
              type='checkbox'
              checked={this.isPassed(item.id, 'lesson')}
            />
          </label>
        </div>
      </td>
    </tr>
  )
  }

  renderTestsList (tests = []) {
    const { location } = this.props
    return tests.map((item, i) =>
    <tr key={i}>
      <td>
        <Link to={{ pathname: `${location.pathname}/test/${item.id}` }}>{item.name}</Link>
      </td>
      <td> </td>
      <td>
        <div className='col-xs-10 col-md-2'>
          <label className='checkbox checkbox-info checkbox-circle' style={{ paddingBottom: '20px' }}>
            <input
              type='checkbox'
              checked={this.isPassed(item.id, 'test')}
            />
          </label>
        </div>
      </td>
    </tr>
  )
  }

  renderSectionsList () {
    const { sections = [] } = this.state
    return (
      <div className='col-xs-12 col-md-12'>
        <div className='col-xs-12 col-md-8'>
          <table className='table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Length</th>
                <th> </th>
              </tr>
            </thead>
            {sections.map((item, i) =>
              <tbody key={i}>
                <tr>
                  <td>
                    <div className='col-xs-12 col-md-4'>{item.name}</div>
                  </td>
                  <td />
                </tr>
                {this.renderLessonsList(item.lessons)}
                {this.renderTestsList(item.tests)}
              </tbody>
            )}
          </table>
        </div>
      </div>
    )
  }

  buttonClick () {
    const { showComments, buttonName } = this.state
    const newButtonName = (buttonName === 'Show Comments') ? 'Hide Comments' : 'Show Comments'
    this.setState({ showComments: !showComments, buttonName: newButtonName })
  }

  renderShowCommentsButton () {
    const { buttonName } = this.state
    return (
      <div className='col-xs-12 col-md-10'>
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
  countNumberLessonsInCourse (course = {}) {
    const lessonsNumbersArray = course.sections.map(section => {
      if (section.lessonsIds) {
        return section.lessonsIds.length
      }
    })
    const numberLessonsInCourse = lessonsNumbersArray.reduce((a, b) => {
      return a + b
    })
    return numberLessonsInCourse
  }

  countNextLessonId (course) {
    const { params } = this.props
    const { userCourses } = this.props.auth.user
    const courseFromUser = userCourses.find(item => item.courseId === params.courseId)
    const { watchedLessonsIds } = courseFromUser

    let nextId = false
    if (!!watchedLessonsIds) {
      const watchedLessonsLength = watchedLessonsIds.length
      // count nextLessonId if lesson is ended
      // take last watched lesson
      const lastLessonId = courseFromUser.watchedLessonsIds[watchedLessonsLength - 1]
      // find last watched section and index
      const filteredSection = course.sections.filter(section =>
       section.lessonsIds)
      const currentSectionIndex = filteredSection.findIndex(section =>
       section.lessonsIds.includes(lastLessonId))
       // if lastWathedLesson was deleted, take 2 section lesson
      const trueCurrentSectionIndex = currentSectionIndex === -1 ? 1 : currentSectionIndex
      const currentSection = course.sections[trueCurrentSectionIndex]
        // find index of last watched lesson in currentSection
      const lastLessonIdIndex = currentSection.lessonsIds.findIndex(lessonId =>
          lessonId === lastLessonId)
      const nextLessonIdInCurrentSection = currentSection.lessonsIds[lastLessonIdIndex + 1]
          // if there is such a lesson in current section, then use it
      if (nextLessonIdInCurrentSection) {
        nextId = nextLessonIdInCurrentSection
            // otherwise chech if there is 1 more section
            // if there is then use next section, first lesson
      } else if (course.sections[currentSectionIndex + 1]) {
        nextId = course.sections[currentSectionIndex + 1].lessonsIds[0]
      }
    }
    return nextId
  }

  countNewWatchLessonId (courseFromUser) {
    const { nextLessonId } = this.state
    const isLessonEnded = courseFromUser.watchedLessonsIds[(courseFromUser.watchedLessonsIds.length - 1)] ===
    courseFromUser.startedLessonsIds[(courseFromUser.startedLessonsIds.length - 1)]
    // if lesson is not ended use last watched lesson else count nextLessonId
    const newWatchLessonId = isLessonEnded ?
    nextLessonId : courseFromUser.startedLessonsIds[(courseFromUser.startedLessonsIds.length - 1)]
    return newWatchLessonId
  }
  renderProgressBar () {
    const { location, params } = this.props
    const { userCourses } = this.props.auth.user
    const { numberLessonsInCourse, firstLessonId } = this.state
    const courseFromUser = userCourses.find(item => item.courseId === params.courseId)

    const numberWatchedlessons = courseFromUser.uniqueWatchedLessonsIds ? courseFromUser.uniqueWatchedLessonsIds.length : 0
    const buttonName = courseFromUser.uniqueWatchedLessonsIds ? 'Continue lesson' : 'Start first lesson'
    // if 0 watched take 1st lesson of first section else count watchLessonId``
    const watchLessonId = courseFromUser.uniqueWatchedLessonsIds ? this.countNewWatchLessonId(courseFromUser) :
    firstLessonId
    const isCorseWatched = false
    if (courseFromUser.uniqueWatchedLessonsIds) {
      const isCorseWatched = courseFromUser.uniqueWatchedLessonsIds.length === numberLessonsInCourse
    }
    const percent = numberWatchedlessons / numberLessonsInCourse

    return (
      <div>
        <div className='col-xs-6 col-md-12' style={{ padding: '15px' }}>
          <label className='control-label col-xs-8 col-md-6'>
            Your progress: {numberWatchedlessons} lessons from {numberLessonsInCourse} </label>
        </div>
        <div className='col-xs-6 col-md-6' style={{ padding: '15px' }}>
          <div className='progress'>
            <div className='progress-bar progress-bar-success' role='progressbar' aria-valuenow='40'
              aria-valuemin='0' aria-valuemax='100' style={{ width: `${percent * 100}%` }}>
              {Math.round(percent * 100)}% Complete (success)
            </div>
          </div>
        </div>
        <div className='col-xs-6 col-md-6' style={{ padding: '15px' }}>
          {!!watchLessonId && !isCorseWatched && <button
            type='button'
            style={{ width:'30%', margin: '15px' }}
            className='btn btn-success lg'
            onClick={(e) => { browserHistory.push({ pathname: `${location.pathname}/lesson/${watchLessonId}` }) }}
            >{buttonName}
          </button>
        }
        </div>
      </div>
    )
  }

  render () {
    const { course, showComments } = this.state
    const { params } = this.props
    return (
      <div className='container-course'>
        <div className='col-xs-12 col-md-12'>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Name:</label>
            <div> {course.name}</div>
          </div>
          <div className='col-xs-10' style={{ padding: '15px' }}>
            <label className='control-label col-xs-2'>Main photo:</label>
            <img src={course.mainPhoto} className='img-thumbnail' width='400px' height='250px' />
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Description:</label>
            <div> {course.description}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Duration:</label>
            <div> {course.duration}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Price:</label>
            <div> {course.price}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Discipline:</label>
            <div> {course.discipline}</div>
          </div>
        </div>
        {this.renderShowCommentsButton()}
        {showComments && <div className='col-xs-12 col-md-10'>
          <ul className='list-unstyled'>
            <CommentList
              courseId={params.courseId}
            />
          </ul>
        </div>
      }
        {this.renderProgressBar()}
        <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
          <label className='control-label col-xs-8' style={{ padding: '15px' }}>Sections: </label>
          <ul className='list-unstyled'>
            {this.renderSectionsList()}
          </ul>
        </div>
      </div>
    )
  }
}

MainView.propTypes = {
  params: PropTypes.object,
  location: PropTypes.object,
  auth: React.PropTypes.object,
  user: React.PropTypes.object
}

const mapStateToProps = state => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(MainView)

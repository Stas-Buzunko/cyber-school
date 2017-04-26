import React, { Component, PropTypes } from 'react'
import firebase from 'firebase'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      course: {},
      courseLoaded: false,
      lessons: [],
      lessonsLoaded: false,
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
          const promisesLessons = section.lessonsIds.map(id =>
            firebase.database().ref('lessons/' + id)
            .once('value')
            .then(snapshot2 => ({ ...snapshot2.val(), id }))
          )
          return Promise.all(promisesLessons).then(lessons => {
            section = { ...section, lessons }
            return (section)
          })
        })
        Promise.all(newSectionsLessons).then(result => {
          const numberLessonsInCourse = this.countNumberLessonsInCourse(course)
          const nextLessonId = this.countNextLessonId(course)
          this.setState({
            sections: result,
            course,
            comments: course.comments,
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

  countNumberLessonsInCourse (course = {}) {
    const lessonsNumbersArray = course.sections.map(section => {
      return section.lessonsIds.length
    })
    const numberLessonsInCourse = lessonsNumbersArray.reduce((a, b) => {
      return a + b
    })
    return numberLessonsInCourse
  }

  countNextLessonId (course) {
    const { params } = this.props
    const { userCourses } = this.props.auth.user
    const { watchedLessonsIds = {} } = userCourses
    const courseFromUser = userCourses.find(item => item.courseId === params.courseId)
    const watchedLessonsLength = watchedLessonsIds.length || 0

    let nextId = false

    // if 0 watched
    if (!watchedLessonsLength) {
      // return first section, first lesson
      nextId = course.sections[0].lessonsIds[0]
    } else {
      // take last watched lesson
      const lastLessonId = courseFromUser.watchedLessonsIds[watchedLessonsLength - 1]

      // find last watched section and index
      const currentSectionIndex = course.sections.findIndex(section =>
        section.lessonsIds.includes(lastLessonId))
      const currentSection = course.sections[currentSectionIndex]

      // find lessons in section that haven't been watched yet
      const lessonLeftInSection = currentSection.lessonsIds.find(lesson =>
        !courseFromUser.watchedLessonsIds.includes(lesson))

      // if there is such a lesson in current section, then use it
      if (lessonLeftInSection) {
        nextId = lessonLeftInSection

        // otherwise chech if there is 1 more section
        // if there is then use next section, first lesson
      } else if (course.sections[currentSectionIndex + 1]) {
        nextId = course.sections[currentSectionIndex + 1].lessonsIds[0]
      }
    }

    // const findNextLessonIdArray = course.sections.map((section) => {
    //   const index = section.lessonsIds.findIndex(item => item === lastLessonId)
    //   const nextLessonId = (index === -1)
    //   ? false
    //   : section.lessonsIds[index + 1] ? section.lessonsIds[(index + 1)] : section.sectionNumber
    //   return nextLessonId
    // })

    // const nextId = findNextLessonIdArray.find(item => item !== false)

    // const nextId = course.sections.find(section => {
    //   const index = section.lessonsIds.findIndex(item => item === lastLessonId)
    //   const nextLessonId = (index !== -1) && section.lessonsIds[index + 1]
    //   ? section.lessonsIds[(index + 1)]
    //   : section.sectionNumber
    //   return nextLessonId
    // })

    // const NextSectionId = course.sections[(nextId + 1)] ? course.sections[(nextId + 1)].lessonsIds[0] : false
    // const nextLessonId = (typeof nextId === 'number') ? NextSectionId : nextId
    // return nextLessonId

    return nextId
  }
  countNewWatchLessonId (courseFromUser) {
    const { nextLessonId } = this.state
    const isLessonEnded = courseFromUser.watchedLessonsIds[(courseFromUser.watchedLessonsIds.length - 1)] ===
    courseFromUser.startedLessonsIds[(courseFromUser.startedLessonsIds.length - 1)]
    const newWatchLessonId = isLessonEnded ?
    nextLessonId : courseFromUser.startedLessonsIds[(courseFromUser.startedLessonsIds.length - 1)]
    return newWatchLessonId
  }
  renderProgressBar () {
    const { location, params } = this.props
    const { userCourses } = this.props.auth.user
    const { numberLessonsInCourse, firstLessonId } = this.state

    const courseFromUser = userCourses.find(item => item.courseId === params.courseId)
    // here is a bug
    const watchLessonId = courseFromUser.watchedLessonsIds ? this.countNewWatchLessonId(courseFromUser)
    : firstLessonId
    const numberWatchedlessons = courseFromUser.uniqueWatchedLessonsIds ? courseFromUser.uniqueWatchedLessonsIds.length
    : 0
    const percent = numberWatchedlessons / numberLessonsInCourse
    const buttonName = courseFromUser.uniqueWatchedLessonsIds ? 'Continue lesson' : 'Start first lesson'
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
          {watchLessonId && <button
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
    const { course, comments } = this.state
    const { params } = this.props
    return (
      <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
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

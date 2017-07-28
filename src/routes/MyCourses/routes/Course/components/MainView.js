import React, { Component, PropTypes } from 'react'
import firebase from 'firebase'
import CommentToForum from '../containers/CommentToForumContainer'
import QuestionsToCoach from '../containers/QuestionsToCoachContainer'
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
      userCourses: [],
      newWatchLessonId: [],
      nextLessonId: '',
      firstLessonId: '',
      showSection: false,
      set: new Set()
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
            firstLessonId: course.sections[1].lessonsIds[0]
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
    const passed = (type === 'lesson') ? array.findIndex(item => item === id)
    : array.findIndex(item => item.testId === id)
    // this.setState({ mark })
    if (passed === -1) {
      return [false, 0]
    } else {
      const mark = array[`${passed}`].mark ? array[`${passed}`].mark : 0
      return [true, mark]
    }
  }

  renderLessonsList (lessons = []) {
    const { location } = this.props
    const isBonusLesson = (item) => {
      return (item.isBonus === true)
    }

    return lessons.map((item, i) =>
    <div key={i}>
      {!isBonusLesson(item) && <Link className='link' to={{ pathname: `${location.pathname}/lesson/${item.id}`}}>{item.name}</Link>}
      {isBonusLesson(item) && <Link className='bonus-link' to={{ pathname: `${location.pathname}/lesson/${item.id}`}}>{item.name}</Link>}
      {this.isPassed(item.id, 'lesson')[0] && <div className='checkbox'> </div> }
    </div>
  )
  }

  renderTestsList (tests = []) {
    const { location } = this.props
    return tests.map((item, i) =>
    <div key={i} >
        <Link className='link' to={{ pathname: `${location.pathname}/test/${item.id}`}}>{item.name}</Link>
        {this.isPassed(item.id, 'test')[0] && <div className='checkbox'> </div> }
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

  countNumberLessonsInCourse (course = {}) {
    const newSections = course.sections.filter((item) => item.sectionNumber !== 0)
    const lessonsNumbersArray = newSections.map(section => {
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
    const isCorseWatched = courseFromUser.uniqueWatchedLessonsIds ?
      courseFromUser.uniqueWatchedLessonsIds.length === numberLessonsInCourse : false
    const percent = numberWatchedlessons / numberLessonsInCourse

    return (
      <div>
      {!!watchLessonId && !isCorseWatched && <div className='button-continie-lesson'
        onClick={(e) => { browserHistory.push({ pathname: `${location.pathname}/lesson/${watchLessonId}` }) }}
        >{buttonName}
      </div>
    }</div>
  )
  }
  renderCircles (sections, fromN, toN) {
    const widthPercent = 100/(toN-fromN+1)
    const padding = (807/(toN-fromN+1)-79)/2
    const isCircle = (n) => {
      if ((n >= fromN) && (n <= toN)) {
        return true
      } else {
        return false
      }
    }
    return sections.map((item, i) =>
      <div key={i}>
        {isCircle(i+1) && <div className='circle' style={{width:`${widthPercent}%`, padding:`0px ${padding}px`}}>
          {this.isPassed(item.testsIds[0], 'test')[1] > 70 && this.isPassed(item.testsIds[0], 'test')[1] < 85 &&
            <div className='starFee'>{i+1}</div>
          }
          {this.isPassed(item.testsIds[0], 'test')[1] >= 85 && this.isPassed(item.testsIds[0], 'test')[1] < 100 &&
            <div className='starFee'>{i+1}</div>
          }
          {this.isPassed(item.testsIds[0], 'test')[1] === 100 &&
            <div className='starFff'>{i+1}</div>
          }
          {!this.isPassed(item.testsIds[0], 'test')[0] &&
            <div className='starEee'>{i+1}</div>
          }
          </div>
        }
      </div>
     )
  }
  renderProgressLesson () {
    const { sections = [] } = this.state
    const newSections = sections.filter((item) => item.sectionNumber !== 0)
    const oneElem = newSections[0]
    const newEtsections = newSections.concat(newSections).concat(newSections).concat(newSections).concat(oneElem)
    const toN = (newEtsections.length % 2 === 0) ? (newEtsections.length / 2) : Math.round(newEtsections.length/2)
    return (
      <div>
        <div className='starRow' style={{ width:'100%' }}>{this.renderCircles(newEtsections, 1, toN)}</div>
        <div className='starRow' style={{ width:'100%' }}>{this.renderCircles(newEtsections, toN + 1, newEtsections.length)}</div>
      </div>
    )
  }

  render () {
    const { course, courseLoaded } = this.state
    const { params } = this.props
    if (!courseLoaded) {
      return (<div className='container'>Loading...</div>)
    }
    return (
      <div className='container container-course'>
        <div className='row'>
          <div className='col-xs-3 col-md-3'>
            <div className='button-lesson-name'> {course.name}</div>
            <div className='section-list'>
              <ul className='list-unstyled'>
                {this.renderSectionsList()}
                {this.renderSectionsList()}
                {this.renderSectionsList()}
                {this.renderSectionsList()}
              </ul>
            </div>
            <div className='button-lesson-name'> {course.name}</div>
            <div>{this.renderProgressBar()}</div>
            <div className='button-coach-chat'>Чат с тренером</div>
              <QuestionsToCoach
                courseId={params.courseId}
              />
          </div>
          <div className='col-xs-9 col-md-9'>
            <div className='hi-words'>
              <p>Приветствие от коуча для вип студента</p>
              <p>Улучши свои навыки и контроль за игрой</p>
            </div>
            <div className='progress-lesson'>{this.renderProgressLesson()}</div>
            <div className='questions'>
              <CommentToForum courseId={params.courseId} />
            </div>
          </div>
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

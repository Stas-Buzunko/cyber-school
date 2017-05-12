import React, { Component, PropTypes } from 'react'
import firebase from 'firebase'
import { Link } from 'react-router'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      course: {},
      courseLoaded: false,
      lessons: []
    }
  }

  componentWillMount () {
    const { courseId } = this.props.params
    this.fetchItem(courseId)
  }

  fetchItem (courseId) {
    this.setState({
      forumSections: [],
      sectionsLoaded: false
    })
    firebase.database().ref('courses/' + courseId)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const course = object
        this.setState({ course, courseLoaded: true })
        this.fetchLessons(course.sections)
      } else {
        this.setState({ courseLoaded: true })
      }
    })
  }

  fetchLessons (sections) {
    this.setState({
      lessons: [],
      lessonsLoaded: false
    })
    let lessonsIds = []
    sections.forEach(section => {
      section.lessonsIds.forEach(lessonId =>
        lessonsIds.push(lessonId))
    })
    const promises = lessonsIds.map(id => {
      return firebase.database().ref('lessons/' + id)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        const lessonFromId = object
        lessonFromId.id = id
        return (lessonFromId)
      })
    })
    Promise.all(promises).then(result => {
      this.setState({
        lessons: result,
        lessonsLoaded: true
      })
    })
  }

  renderLessonNames () {
    const { location } = this.props
    const { lessons } = this.state
    return (lessons.map((item, i) =>
      <div key={i}>
        <Link to={{ pathname: `${location.pathname}/lesson/${item.id}` }}>{item.name}</Link>
      </div>
    )
    )
  }

  render () {
    const { course = {} } = this.state
    return (
      <div className='col-xs-12 col-md-12'>
        <div className='col-xs-12 col-md-8'>
          <label className='control-label col-xs-2 col-md-12' style={{ padding: '15px' }}>{course.name}</label>
          <div className='col-xs-12 col-md-12' style={{ padding: '15px' }}>
            <label className='control-label col-xs-2 col-md-12 text-left' style={{ padding: '15px' }}>
              Course comments:
            </label>
            <div>
              <Link to={{ pathname: `${location.pathname}/generalComments` }}>General comments</Link>
            </div>
            <label className='control-label col-xs-2 col-md-12 text-left' style={{ padding: '15px' }}>
              Lesson comments:
            </label>
            {this.renderLessonNames()}
          </div>
        </div>
      </div>
    )
  }
}

MainView.propTypes = {
  location: PropTypes.object,
  params: PropTypes.object
}

export default MainView

import React, { Component } from 'react'
import firebase from 'firebase'
import { browserHistory } from 'react-router'

class UserCoursesList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      courses: [],
      coursesLoaded: false,
      userCourses: []
    }
  }

  componentWillMount () {
    const { userCourses } = this.props.auth.user
    if (userCourses) {
      this.fetchCourses(userCourses)
    } else {
      this.setState({
        coursesLoaded: true
      })
    }
  }

  fetchCourses (userCourses) {
    this.setState({
      courses: [],
      coursesLoaded: false
    })

    const promises = userCourses.map(item => {
      return firebase.database().ref('courses/' + item.courseId)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        if (object !== null) {
          object.id = item.courseId
          return (object)
        }
      })
    })
    Promise.all(promises).then(result => {
      this.setState({
        courses: result,
        coursesLoaded: true
      })
    })
  }

  renderProgressBar (course) {
    const { userCourses } = this.props.auth.user
    const courseFromUser = userCourses.find((item, i) => item.courseId === course.id)
    const numberWatchedlessons = courseFromUser.uniqueWatchedLessonsIds ? courseFromUser.uniqueWatchedLessonsIds.length : 0

    const lessonsNumbersArray = course.sections.map(section => {
      const lengthLessonsId = section.lessonsIds ? section.lessonsIds.length : 0
      return lengthLessonsId
    })
    const numberLessonsInCourse = lessonsNumbersArray.reduce((a, b) => {
      return a + b
    })

    const percent = Math.round(numberWatchedlessons / numberLessonsInCourse * 100)
    return (
      <div className='progress'>
        <div className='progress-bar progress-bar-success' role='progressbar' aria-valuenow='40'
          aria-valuemin='0' aria-valuemax='100' style={{ width: `${percent}%` }}>
          {percent}% Complete (success)
        </div>
      </div>
    )
  }

  renderCourses () {
    const { courses = [] } = this.state
    return courses.map((course, i) => (
      <div key={i}>
        <div className='col-sm-6 col-md-4' >
          <div className='thumbnail' style={{ height: '360px' }}>
            <img src={course.mainPhoto} width='300px' height='250px' alt='loading' />
            <div className='caption'>
              <h5>{course.name} </h5>
              <h5>{course.description}</h5>
              <div style={{ padding: '15px' }} >
                {this.renderProgressBar(course)}
              </div>
              <button
                type='button'
                className='btn btn-primary'
                onClick={() => { browserHistory.push({ pathname: `/myCourses/course/${course.id}` }) }}
                >More details
              </button>
            </div>
          </div>
        </div>
      </div>
    ))
  }

  render () {
    const { coursesLoaded, courses } = this.state
    if (!coursesLoaded) {
      return (<div>Loading...</div>)
    }
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12 col-md-12'>
            <h4>You have {courses.length} paid courses</h4>
            <div>
              {this.renderCourses()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
UserCoursesList.propTypes = {
  userCourses: React.PropTypes.array,
  auth: React.PropTypes.object,
  user: React.PropTypes.object
}

export default UserCoursesList

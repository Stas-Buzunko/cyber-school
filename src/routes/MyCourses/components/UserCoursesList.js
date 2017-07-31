import React, { Component } from 'react'
import firebase from 'firebase'
import { browserHistory } from 'react-router'
import './MainView.scss'

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
      const newResult = result.filter(item => item)
      this.setState({
        courses: newResult,
        coursesLoaded: true
      })
    })
  }

  renderProgressBar (course) {
    const { userCourses } = this.props.auth.user
    const courseFromUser = userCourses.find((item, i) => item.courseId === course.id)
    const numberWatchedlessons = courseFromUser.uniqueWatchedLessonsIds ? courseFromUser.uniqueWatchedLessonsIds.length : 0
    const newSections = course.sections.filter((item) => item.sectionNumber !== 0)
    const lessonsNumbersArray = newSections.map(section => {
      const lengthLessonsId = section.lessonsIds ? section.lessonsIds.length : 0
      return lengthLessonsId
    })
    const numberLessonsInCourse = lessonsNumbersArray.reduce((a, b) => {
      return a + b
    })
    const percent = Math.round(numberWatchedlessons / numberLessonsInCourse * 100)
    return (
      <div>
        <div className='progress' style={{ margin: '0px 0px 10px 10px' }}>
          <div className='progress-bar' role='progressbar' aria-valuenow='40'
            aria-valuemin='0' aria-valuemax='100' style={{ width: `${percent}%` }}>
            {percent}% Complete
          </div>
        </div>
      </div>
    )
  }
  isVip (course) {
    const { userVipCourses } = this.props.auth.user
    const vipCourseFromUser = userVipCourses.find((item, i) => item.courseId === course.id)
    return (
      <div>
        {!!vipCourseFromUser && <div className='vip-course'> VipCourse</div> }
        {!vipCourseFromUser && <div className='vip-course'></div> }
      </div>
    )
  }

  renderCourses () {
    const { courses } = this.state
    const newCourses = [].concat(courses).concat(courses)
    return newCourses.map((course, i) => (
      <div key={i} className='frame-course' style={{ padding: '5px', margin: '15px 10px 10px 10px' }}>
        <img src={course.mainPhoto} width='352px' height='150px' alt='loading' />
        <div className='caption' style={{ padding: '5px 10px 5px 10px' }}>
          <h5 className='frame-name'>{course.name} </h5>
          <h5 className='frame-description'>{course.description}</h5>
          <div>
            {this.renderProgressBar(course)}
          </div>
          {this.isVip(course)}
          <div
            className='button-details'
            style={{ color: 'yellow' }}
            onClick={() => { browserHistory.push({ pathname: `/myCourses/course/${course.id}` }) }}
            >More details
          </div>
        </div>
      </div>
    ))
  }
  render () {
    const { coursesLoaded } = this.state
    if (!coursesLoaded) {
      return (<div>Loading...</div>)
    }
    // const isSCount = (courses.length !== 1)
    // const coursesCount = isSCount ? 'courses' : 'course'
    return (
      <div className='row'>
        <div className='col-xs-12 col-md-12' style={{ padding: '0px' }}>
          <div className='col-xs-2 col-md-2 ikon-dragon'></div>
          <div className='col-xs-3 col-md-3 text-place'>Улучши свои навыки и контроль за игрой</div>
          <div className='col-xs-7 col-md-7 text-frame'> Изучи механизм игры и взаимодействие с командой</div>
        </div>
        <div className='col-xs-12 col-md-12 tab' style={{ padding: '10px 0px 0px 0px' }}>
          <div>
            <span className='my-courses'>Мои курсы</span>
            <div className='div-scroll scroll-horizontal'>
              {this.renderCourses()}
            </div>
          </div>
        </div>
        {/* <h4>You have {courses.length} paid {coursesCount}</h4> */}
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

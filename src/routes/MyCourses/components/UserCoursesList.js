import React, { Component } from 'react'
import firebase from 'firebase'
import { browserHistory } from 'react-router'

class UserCoursesList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      courses: [],
      coursesFetched: false
    }
  }

  componentWillMount () {
    const { userCourses } = this.props
    this.fetchCourses(userCourses)
  }

  fetchCourses (userCourses) {
    this.setState({
      courses: [],
      coursesLoaded: false
    })
    const promises = userCourses.map(item => {
      return firebase.database().ref('courses/' + item.id)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        return (object)
      })
    })
    Promise.all(promises).then(result => {
      this.setState({
        courses: result,
        coursesLoaded: true
      })
    })
  }

  rederCourses () {
    const { courses } = this.state

    return courses.map((course, i) => (
      <div key={i}>
        <div className='col-sm-6 col-md-4' >
          <div className='thumbnail' style={{ height: '300px' }}>
            <img src={course.mainPhoto} width='300px' height='250px' />
            <div className='caption'>
              <h5>{course.name} </h5>
              <h5>{course.description}</h5>
              <button
                type='button'
                className='btn btn-primary'
                onClick={() => { browserHistory.push({ pathname: `/discipline/${course.discipline}/${course.id}` }) }}
                >More details
              </button>
            </div>
          </div>
        </div>
      </div>
    ))
  }

  render () {
    const { coursesFetched, courses } = this.state

    if (!coursesFetched) {
      return (<div>Loading...</div>)
    }

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12 col-md-12'>
            <h4>You have {courses.length} paid courses</h4>
            <div>
              {this.rederCourses()}

            </div>
          </div>
        </div>
      </div>
    )
  }
}
UserCoursesList.propTypes = {
  userCourses: React.PropTypes.object
}

export default UserCoursesList

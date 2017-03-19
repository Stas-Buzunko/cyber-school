import React, { Component } from 'react'
import firebase from 'firebase'

class MainView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      courses: [],
      coursesFetched: false
    }
  }

  componentWillMount () {
    const { params } = this.props
    this.fetchCourses(params.discipline)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.params.discipline !== nextProps.params.discipline) {
      this.fetchCourses(nextProps.params.discipline)
    }
  }

  fetchCourses (discipline) {
    firebase.database().ref('courses')
    .orderByChild('discipline')
    .equalTo(discipline)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()

      if (object !== null) {
        const courses = Object.keys(object).map(id => ({ ...object[id], id }))
        this.setState({ courses, coursesFetched: true })
      } else {
        this.setState({ coursesFetched: true })
      }
    })
  }

  rederCourses () {
    const { courses } = this.state

    return courses.map((course, i) => (
      <div key={i}>
        Description: {course.description}
      </div>
    ))
  }

  render () {
    const { coursesFetched, courses } = this.state
    const { params } = this.props

    if (!coursesFetched) {
      return (<div>Loading...</div>)
    }

    return (
      <div>
        <h3>Total: {courses.length} course for {params.discipline} found</h3>
        <div>
          {this.rederCourses()}
        </div>
      </div>
    )
  }
}

export default MainView

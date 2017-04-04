import React, { Component } from 'react'
import firebase from 'firebase'
import { browserHistory } from 'react-router'
// import Dropzone from 'react-dropzone'
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
    const { discipline } = this.props.params

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
                onClick={() => { browserHistory.push({ pathname: `/discipline/${discipline}/${course.id}` }) }}
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
    const { params } = this.props

    if (!coursesFetched) {
      return (<div>Loading...</div>)
    }

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12 col-md-12'>
            <h4>Total: {courses.length} course for {params.discipline} found</h4>
            <div>
              {this.rederCourses()}

            </div>
          </div>
        </div>
      </div>
    )
  }
}
MainView.propTypes = {
  params: React.PropTypes.object,
  discipline: React.PropTypes.string
}

export default MainView

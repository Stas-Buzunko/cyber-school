import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import firebase from 'firebase'

class CoursesList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      courses: [],
      coursesLoaded: false
    }
  };

  componentWillMount () {
    this.fetchItems()
  }

  fetchItems () {
    this.setState({
      courses: [],
      coursesLoaded: false
    })
    firebase.database().ref('courses/')
     .once('value')
     .then(snapshot => {
       const object = snapshot.val()
       if (object !== null) {
         const courses = Object.keys(object).map(id => ({ ...object[id], id }))
         this.setState({ courses, coursesLoaded: true })
       } else {
         this.setState({ coursesLoaded: true })
       }
     }
    )
  }

  renderCoursesList () {
    const { courses } = this.state

    return courses.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
            <div className='col-md-12'>
              <label className='control-label col-md-4'>Name:</label>
              <div  className='col-md-8'> {item.name}</div>
            </div>
            <div className='col-xs-10'>
              <label className='control-label col-md-4'>Description:</label>
              <div className='col-md-8'> {item.description}</div>
            </div>
            <div className='col-xs-10'>
              <label className='control-label col-md-4'>Main photo:</label>
                <img src={item.mainPhoto} width='300px' height='200px' alt='Loading'/>
            </div>
            <div className='col-xs-10'>
              <label className='control-label col-md-4'>Duration:</label>
              <div className='col-md-8'> {item.duration}</div>
            </div>
            <div className='col-xs-10'>
              <label className='control-label col-md-4'>Price:</label>
              <div className='col-md-8'> {item.price}</div>
            </div>
            <div className='col-xs-10'>
              <label className='control-label col-md-4'>vipPrice:</label>
              <div className='col-md-8'> {item.vipPrice}</div>
            </div>
            <div className='col-xs-10'>
              <label className='control-label col-md-4'>Discipline:</label>
              <div className='col-md-8'> {item.discipline}</div>
            </div>

          <div className='col-xs-12 col-md-4'>
            <button
              type='button'
              className='btn btn-primary lg'
              onClick={() => { browserHistory.push({ pathname: `/admin/courses/edit/${item.id}` }) }}
              >Edit course
            </button>
          </div>
        </div>
      </li>
    )
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              {this.renderCoursesList()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
export default CoursesList

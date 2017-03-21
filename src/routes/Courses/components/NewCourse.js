import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import toastr from 'toastr'
import firebase from 'firebase'
import { show } from 'redux-modal'
import { connect } from 'react-redux'
import LessonComponent from './LessonComponent'
import LessonsList from './LessonList'

class NewCourse extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      description: '',
      mainPhoto:'',
      duration:'',
      dateUploaded:'',
      price:'',
      discipline:'',
      author:'',
      lessons: [],
      error: ''
    }
  }

  componentWillMount () {
  }

  saveCourse () {
    const { name, description, mainPhoto, duration, price, discipline, author, lessons } = this.state
    const dateUploaded = Date.now()
    if (!name || !description || !mainPhoto || !duration || !dateUploaded || !price || !discipline || !author) {
      if (!name) {
        toastr.error('Please, fill name')
      };
      if (!description) {
        toastr.error('Please, fill description')
      };
      if (!mainPhoto) {
        toastr.error('Please, fill main photo')
      };
      if (!duration) {
        toastr.error('Please, fill duration')
      };
      if (!dateUploaded) {
        toastr.error('Please, fill date uploaded')
      };
      if (!price) {
        toastr.error('Please, fill price')
      };
      if (!discipline) {
        toastr.error('Please, fill discipline')
      };
      if (!author) {
        toastr.error('Please, fill author')
      };
      return false
    }
    this.setState({ error: '' })
    firebase.database().ref('courses/').push({
      name, description, mainPhoto, duration, dateUploaded, price, discipline, author, lessons
    })
      .then(() => {
        toastr.success('Your course saved!')
        browserHistory.push(`/admin/courses`)
      })
  }

  renderLessons () {
    return (
      <div>
        <button
          type='button'
          className='btn btn-success lg'
          onClick={(e) => {
            e.preventDefault()
            this.props.openModal('lesson')
          }}>Add Lesson
        </button>
      </div>
    )
  }

  saveLesson = (lesson) => {
    const lessonKey = firebase.database().ref('lessons/').push().key
    // const lessons = { }
    this.setState({lessons:
      // ...this.state.lessons,
       lessonKey })
    firebase.database().ref('lessons/' + `${lessonKey}`).update({lesson})
    .then(() => {
      toastr.success('Your lesson saved!')
    })
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-10'>
            <form className='form-horizontal'>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Name</label>
                <div className='col-xs-10 col-md-6'>
                  <input type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ name: e.target.value })} />
                </div>
              </div>
              <div className='form-group'>
                <label className='control-label col-xs-2'>Description</label>
                <div className='col-xs-10 col-md-6'>
                  <input type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ description: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>MainPhoto</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ mainPhoto: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Duration</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ duration: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Uploaded date</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ dateUploaded: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Price</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ price: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Discipline</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ discipline: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Author</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ author: e.target.value })} />
                </div>
              </div>

              <label className='control-label col-xs-2 col-md-4'>Lessons: </label>
              <div className='col-xs-2 col-md-10'>
                <ul className='list-unstyled'>
                  {this.renderLessons()}
                  <LessonsList
                    isNewLesson={true}
                    lessonsIds={this.state.lessons}
                  />
                </ul>

              </div>
            </form>

            <div className='col-xs-12 col-md-10'>
              <button
                type='button'
                style={{ width:'50%', margin: '15px' }}
                className='btn btn-success lg'
                onClick={() => { this.saveCourse() }}
              >Save course
            </button>
            </div>
            <p />
          </div>
        </div>
        <LessonComponent
          saveLesson={this.saveLesson}
         />
      </div>
    )
  }
}

const mapDispatchToProps = {
  openModal: show
}

export default connect(
  null,
  mapDispatchToProps
)(NewCourse)

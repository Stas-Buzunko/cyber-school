import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import toastr from 'toastr'
import firebase from 'firebase'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import LessonPopupComponent from './LessonPopupComponent'
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
      lessonsIds: [],
      error: ''
    }
  }

  saveCourse () {
    const { name, description, mainPhoto, duration, price, discipline, author, lessonsIds } = this.state

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
    const comments = ['course comment']
    firebase.database().ref('courses/').push({
      name, description, mainPhoto, duration, dateUploaded, price, discipline, author, lessonsIds, comments
    })
      .then(() => {
        toastr.success('Your course saved!')
        browserHistory.push(`/admin/courses`)
      })
  }

  renderLessonPopup () {
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
    const { lessonsIds } = this.state
    const newLessons = [...lessonsIds, lessonKey]
    this.setState({ lessonsIds: newLessons })

    const { name, description, length, imageUrl, videoUrl, isFree, testId, id } = lesson
    const comments = ['lesson comment']
    firebase.database().ref('lessons/' + lessonKey).update({
      name, description, length, imageUrl, videoUrl, isFree, testId, id, comments
    })
    .then(() => {
      this.props.hideModal('lesson')
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
                  {/* <Dropzone
                    onDrop={this.onDrop}
                    className='dropzone-container' >
                    <div className='drop-text'>Drop your images here</div>
                  </Dropzone> */}
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
                  {this.renderLessonPopup()}
                  <LessonsList
                    isNewLesson={true}
                    lessonsIds={this.state.lessonsIds}
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
        <LessonPopupComponent
          saveLesson={this.saveLesson}
          isNewLesson={true}
         />
      </div>
    )
  }
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}

NewCourse.propTypes = {
  openModal: React.PropTypes.func,
  hideModal: React.PropTypes.func
}

export default connect(
  null,
  mapDispatchToProps
)(NewCourse)

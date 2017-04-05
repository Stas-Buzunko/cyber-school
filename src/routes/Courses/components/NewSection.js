import React, { Component } from 'react'
import toastr from 'toastr'
import firebase from 'firebase'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import LessonPopupComponent from './LessonPopupComponent'
import LessonsList from './LessonList'

class NewSection extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      lessonsIds: [],
      error: ''
    }
    this.saveNewSection = this.saveNewSection.bind(this)
    this.saveLesson = this.saveLesson.bind(this)
    this.renderLessonPopup = this.renderLessonPopup.bind(this)
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
  saveNewSection = () => {
    const { name, lessonsIds } = this.state
    const section = { name, lessonsIds }
    this.props.saveSection(section)
    this.setState({
      name: '',
      lessonsIds: []
     })
  }

  saveLesson = (lesson) => {
    const lessonKey = firebase.database().ref('lessons/').push().key
    const { lessonsIds } = this.state
    const newLessons = [...lessonsIds, lessonKey]
    this.setState({ lessonsIds: newLessons })

    const { name, description, length, imageUrl, videoUrl, isFree, testId, id } = lesson
    const comments = []
    firebase.database().ref('lessons/' + lessonKey).update({
      name, description, length, imageUrl, videoUrl, isFree, testId, id, comments
    })
    .then(() => {
      this.props.hideModal('lesson')
      toastr.success('Your lesson saved!')
    })
  }

  render () {
    const { name } = this.state
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-12'>

            <label className='control-label col-xs-2 col-md-2'>Section name: </label>
            <div className='col-xs-6 col-md-4'>
              <input
                value={name}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({ name: e.target.value })} />
            </div>
            <div className='col-xs-6 col-md-4'>
              <button
                type='button'
                className='btn btn-success lg'
                onClick={(e) => { this.saveNewSection() }}
                >Save section
              </button>
            </div>
          </div>
          <p />
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

NewSection.propTypes = {
  openModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  saveSection: React.PropTypes.func
}

export default connect(
  null,
  mapDispatchToProps
)(NewSection)

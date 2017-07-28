import React, { Component } from 'react'
import toastr from 'toastr'
import firebase from 'firebase'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import LessonPopupComponent from './LessonPopupComponent'
import DeletePopupComponent from './DeletePopupComponent'

class LessonsList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      lessons: [],
      lessonsIds: [],
      lessonsLoaded: false
    }
    this.editLesson = this.editLesson.bind(this)
  }

  componentWillMount () {
    const { lessonsIds = [] } = this.props
    this.fetchItems(lessonsIds)
  }

  componentWillReceiveProps (nextProps) {
    this.props.lessonsIds !== nextProps.lessonsIds && this.fetchItems(nextProps.lessonsIds)
  }

  fetchItems (lessonsIds = []) {
    this.setState({
      lessons: [],
      lessonsLoaded: false
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

  renderLessonPopup (e, isEditSection, isNewLesson, item) {
    e.preventDefault()
    this.props.openModal('lesson', { item, isEditSection, isNewLesson })
  }

  renderDelete (e, id) {
    e.preventDefault()
    const type = 'lesson'
    this.props.openModal('delete', { id, type })
  }

  deleteItem = (id, type) => {
    this.props.deleteItemId(id, type)
  }

  editLesson = (lesson, isEditSection) => {
    if (isEditSection) {
      this.props.saveLesson(lesson)
    } else {
      const lessonKey = lesson.id
      const { name, description, length, imageUrl, videoUrl, isFree, isBonus, testId, task } = lesson
      firebase.database().ref('lessons/' + lessonKey).update({
        name, description, length, imageUrl, videoUrl, isFree, isBonus, testId, task
      })
      .then(() => {
        const lessonKey = lesson.id
        const { lessons } = this.state
        const indexItemToRemove = lessons.findIndex(item => lessonKey === item.id)
        const newArray = [
          ...lessons.slice(0, indexItemToRemove),
          lesson,
          ...lessons.slice(indexItemToRemove + 1)
        ]
        this.setState({ lessons: newArray })
      })
      .then(() => {
        this.props.hideModal('lesson')
        toastr.success('Your lesson saved!')
      })
    }
  }

  renderLessonsList () {
    const { lessons = [] } = this.state
    console.log(this.props)
    const { isNewLesson, isEditSection } = this.props
    return (
      <div>
        {lessons.map((item, i) =>
          <li key={i}>
            <div style={{ padding: '15px' }} >
            <div className='col-md-12'>
              <label className='col-md-3'>Name:</label>
              <div className='col-md-6'> {item.name}</div>
            </div>
            { !!isNewLesson && <div>
                <div className='col-md-12'>
                <label className='col-md-3'>Description:</label>
                <div className='col-md-6'> {item.description}</div>
              </div>
                <div className='col-md-12'>
                <label className='col-md-3'>Length:</label>
                <div className='col-md-6'> {item.length}</div>
              </div>
                <div className='col-md-12'>
                <label className='col-md-3'>VideoUrl:</label>
                <div className='col-md-6'> {item.videoUrl}</div>
              </div>
              <div className='col-md-12'>
                <label className='col-md-3'>IsFree:</label>
                <div className='col-md-6'> {item.isFree}</div>
              </div>
              <div className='col-md-12'>
                <label className='col-md-3'>isBonus:</label>
                <div className='col-md-3'> {item.isBonus}</div>
              </div>
              <div className='col-md-12'>
                <label className='col-md-3'>TestId:</label>
                <div className='col-md-6'> {item.testId}</div>
              </div>
              <div className='col-md-12'>
                <label className='col-md-3'>Task:</label>
                <div className='col-md-6'> {item.task}</div>
              </div>
            </div>}
                <div className='col-md-12'>
                  <label className='col-md-3'>ImageUrl:</label>
                  <img className='col-md-6' src={item.imageUrl} width='300px' height='200px' alt='Loading' />
                </div>

              { !isNewLesson && <div className='col-xs-12 col-md-4'>
                <button
                  type='button'
                  className='btn btn-primary lg'
                  onClick={(e) => {
                    this.renderLessonPopup(e, false, false, item)
                  }}
                  >Edit lesson
                </button>
                <button
                  type='button'
                  className='btn btn-primary lg'
                  onClick={(e) => {
                    this.renderDelete(e, item.id)
                  }}
                  >Delete lesson
                </button>
                <LessonPopupComponent
                  saveLesson={this.editLesson}
                />
              </div>
             }
            </div>
          </li>
        )}
        {isEditSection && <div className='col-xs-12 col-md-4'>
          <button
            type='button'
            className='btn btn-success lg'
            onClick={(e) => {
              this.renderLessonPopup(e, true, true)
            }}
            >Add new lesson
          </button>
          <LessonPopupComponent
            saveLesson={this.editLesson}
          />
        </div> }

        <DeletePopupComponent
            deleteItem={this.deleteItem}
        />
      </div>
    )
  }
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              {this.renderLessonsList()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

LessonsList.propTypes = {
  openModal: React.PropTypes.func,
  lessonsIds: React.PropTypes.array,
  isNewLesson: React.PropTypes.bool,
  isEditSection: React.PropTypes.bool,
  hideModal: React.PropTypes.func,
  saveLesson: React.PropTypes.func,
  deleteItemId: React.PropTypes.func,


}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}

export default connect(
  null,
  mapDispatchToProps
)(LessonsList)

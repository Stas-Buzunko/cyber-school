import React, { Component } from 'react'
import toastr from 'toastr'
import firebase from 'firebase'
import { connectModal, show } from 'redux-modal'
import { connect } from 'react-redux'
import LessonPopupComponent from './LessonPopupComponent'

class LessonsList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      lessons: [],
      lessonsIds: [],
      lessonsLoaded: false
    }
  }

  componentWillMount () {
    const lessonsIds = this.props.lessonsIds
    this.fetchItems(lessonsIds)
    console.log('componentWillMount', lessonsIds)
  }

  componentWillReceiveProps (nextProps) {
    this.props.lessonsIds !== nextProps.lessonsIds && this.fetchItems(nextProps.lessonsIds)
  // &&
  //   const lessonsIds = nextProps.lessonsIds
  // &&  this.setState({ lessonsIds })
  //   && console.log('componentWillUpdate', lessonsIds)
  //   console.log('this.props.lessonsIds', this.props.lessonsIds)
  // console.log('nextProps.lessonsIds',nextProps.lessonsIds)
  }

  fetchItems (lessonsIds) {
    this.setState({
      lessons: [],
      lessonsLoaded: false
    })

    lessonsIds.map(id => {
      firebase.database().ref('lessons/' + `${id}`)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        if (object !== null) {
          const lessonFromId = Object.keys(object).map(id => ({ ...object[id], id }))
          const lessons = this.state.lessons
          lessonFromId.map(id => lessons.push(id))
          this.setState({ lessons, lessonsLoaded: true })
        } else {
          this.setState({ coursesLoaded: true })
        }
      })
    }
    )
  }

  renderLessonPopup (e, item) {
    e.preventDefault()
    this.props.openModal('lesson', { item })
  }

  saveLesson = (lesson) => {
    const lessonKey = firebase.database().ref('lessons/').push().key
    const lessonsIds = this.state.lessonsIds
    lessonsIds.push(lessonKey)
    this.setState({ lessonsIds })
    firebase.database().ref('lessons/' + `${lessonKey}`).update({ lesson })
    .then(() => {
      toastr.success('Your lesson saved!')
    })
  }

  renderLessonsList () {
    const { lessons } = this.state
    const isNewLesson = this.props.isNewLesson
    return lessons.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-12 col-md-8'>

            <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Name:</label>
              <div> {item.name}</div>
            </div>
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Description:</label>
              <div> {item.description}</div>
            </div>}
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Length:</label>
              <div> {item.length}</div>
            </div>}
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>ImageUrl:</label>
              <div> {item.imageUrl}</div>
            </div>}
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>VideoUrl:</label>
              <div> {item.videoUrl}</div>
            </div>}
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>IsFree:</label>
              <div> {item.isFree}</div>
            </div>}
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>TestId:</label>
              <div> {item.testId}</div>
            </div>}
            { !!isNewLesson && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Comments:</label>
              <div> {item.comments}</div>
            </div>}
          </div>
          { !isNewLesson && <div className='col-xs-12 col-md-4'>
            <button
              type='button'
              className='btn btn-primary lg'
              onClick={(e) => {
                this.renderLessonPopup(e, item)
              }}
              >Edit lesson
            </button>
            <LessonPopupComponent
              isNewLesson={false}
              saveLesson={this.saveLesson}

              />
          </div> }
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
  isNewLesson: React.PropTypes.bool
}

const mapDispatchToProps = {
  openModal: show
}

export default connect(
  null,
  mapDispatchToProps
)(LessonsList)

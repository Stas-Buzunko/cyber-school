import React, { Component } from 'react'
import toastr from 'toastr'
import firebase from 'firebase'
import { connectModal } from 'redux-modal'
import { Modal } from 'react-bootstrap'
import { show } from 'redux-modal'
import { connect } from 'react-redux'
import LessonComponent from './LessonComponent'

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
  }

  componentWillReceiveProps(nextProps) {
    const lessonsIds = nextProps.lessonsIds
    this.fetchItems(lessonsIds)
  }

  fetchItems (lessonsIds) {
    this.setState({
      lessons: [],
      lessonsLoaded: false
    })

    console.log("list",lessonsIds)
    // lessonsIds.map(id => {
    firebase.database().ref('lessons/'
    + `${lessonsIds}`
  )
     .once('value')
     .then(snapshot => {
       const object = snapshot.val()
       if (object !== null) {
         const lessons = Object.keys(object).map(id => ({ ...object[id], id }))
         this.setState({ lessons, lessonsLoaded: true })
       } else {
         this.setState({ coursesLoaded: true })
       }
     }
    )
  // }
  //   )
  }

  renderLessons () {
    this.props.openModal('lesson')
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
              onClick={() => {
                {this.renderLessons() }
              }}
              >Edit lesson</button>
            <LessonComponent
              isNewLesson={false}
              saveLesson={this.saveLesson}
              lesson={item}
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

const mapDispatchToProps = {
  openModal: show
}

export default connect(
  null,
  mapDispatchToProps
)(LessonsList)

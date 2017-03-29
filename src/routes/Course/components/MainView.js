import React, { Component } from 'react'
import firebase from 'firebase'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import CommentPopupComponent from './CommentPopupComponent'
import CommentList from './CommentList'
import toastr from 'toastr'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      course: [],
      courseLoaded: false,
      lessons: '',
      lessonsLoaded: false,
      comments: []
    }
  }

  componentWillMount () {
    const { params } = this.props
    this.fetchItem(params.id)
  }

  fetchItem (id) {
    this.setState({
      course: [],
      courseLoaded: false,
      lessons: [],
      lessonsLoaded: false
    })

    firebase.database().ref('courses/' + id)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const course = object
        const promises = course.lessonsIds.map(id => {
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
            course,
            comments: course.comments,
            courseLoaded: true,
            lessonsLoaded: true
          })
        })
      } else {
        this.setState({ courseLoaded: true })
      }
    })
  }

  renderLessonsList () {
    const { lessons } = this.state
    return lessons.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12'>
          <div className='col-xs-12 col-md-8'>

            <div className='col-xs-6'>
              <label className='control-label col-xs-2'>Name:</label>
              <div> {item.name}</div>
            </div>
            <label className='control-label col-xs-2'>Length:</label>
            <div> {item.length}</div>
          </div>
        </div>
      </li>
    )
  }

  saveComment = (comment) => {
    const {id} = this.props.params
    firebase.database().ref('courses/' + id)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const comments = object.comments
        this.setState({ comments })
      }
    })
    .then(() => {
      const { comments } = this.state
      const newComments = [ ...comments, comment ]
      this.setState({ comments: newComments })
    })
    .then(() => {
      const { comments } = this.state
      firebase.database().ref('courses/' + id).update({ comments })
    })
    .then(() => {
      this.props.hideModal('comment')
      toastr.success('Your comment saved!')
    })
  }

  renderCommentPopup () {
    return (
      <div>
        <button
          type='button'
          className='btn btn-success lg'
          onClick={(e) => {
            e.preventDefault()
            this.props.openModal('comment')
          }}>Add Comment
        </button>
      </div>
    )
  }

  render () {
    const { course, comments } = this.state
    const { params } = this.props
    return (
      <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
        <div className='col-xs-12 col-md-12'>

          <div className='col-xs-10' style={{ padding: '15px' }}>
            <label className='control-label col-xs-2'>Main photo:</label>
            <img src={course.mainPhoto} className='img-thumbnail' width='400px' height='250px' />
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Name:</label>
            <div> {course.name}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Description:</label>
            <div> {course.description}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Duration:</label>
            <div> {course.duration}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Price:</label>
            <div> {course.price}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Discipline:</label>
            <div> {course.discipline}</div>
          </div>
        </div>
        <div className='col-xs-12 col-md-10'>
          <ul className='list-unstyled'>
            {this.renderCommentPopup(params.id) }
            <CommentList
              comments={comments}
            />
          </ul>
        </div>
        <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
          <label className='control-label col-xs-8' style={{ padding: '15px' }}>Lessons: </label>
          <ul className='list-unstyled'>
            {this.renderLessonsList()}
          </ul>
        </div>
        <CommentPopupComponent
          saveComment={this.saveComment} />
      </div>
    )
  }
  }
MainView.propTypes = {
  params: React.PropTypes.object,
  openModal: React.PropTypes.func,
  hideModal: React.PropTypes.func
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide

}

export default connect(
  null,
  mapDispatchToProps
)(MainView)

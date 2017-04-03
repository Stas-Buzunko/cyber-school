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
      lesson: [],
      lessonLoaded: false,
      comments: []
    }
  }

  componentWillMount () {
    const { params } = this.props
    this.fetchItem(params.id)
  }

  fetchItem (id) {
    this.setState({
      lesson: [],
      lessonLoaded: false
    })
    firebase.database().ref('lessons/' + id)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const lesson = object
        lesson.id = id
        this.setState({ lesson })
      } else {
        this.setState({ lessonLoaded: true })
      }
    })
  }

  renderLesson () {
    const { lesson } = this.state
    return (
      <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
        <div className='col-xs-12 col-md-8'>

          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Name:</label>
            <div> {lesson.name}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Description:</label>
            <div> {lesson.description}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Length:</label>
            <div> {lesson.length}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>ImageUrl:</label>
            <div> {lesson.imageUrl}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>VideoUrl:</label>
            <div> {lesson.videoUrl}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>IsFree:</label>
            <div> {lesson.isFree}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>TestId:</label>
            <div> {lesson.testId}</div>
          </div>

        </div>
      </div>
    )
  }

  render () {
    const { lesson } = this.state
    const { params } = this.props
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              {this.renderLesson()}
            </ul>
          </div>
        </div>
        <div className='col-xs-12 col-md-10'>
          <ul className='list-unstyled'>
            <CommentList
              comments={lesson.comments}
              courseId={params.id}
            />
          </ul>
        </div>
      </div>
    )
  }
}
MainView.propTypes = {
  params: React.PropTypes.object,
  openModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  saveComment: React.PropTypes.func
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide

}

export default connect(
  null,
  mapDispatchToProps
)(MainView)

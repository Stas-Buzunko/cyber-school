import React, { Component } from 'react'
import firebase from 'firebase'
import CommentList from './CommentList'
import VideoPlayer from './VideoPlayer'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lesson: [],
      lessonLoaded: false,
      comments: [],
      userCourses: {}
    }
    this.videoEnded = this.videoEnded.bind(this)
  }

  componentWillMount () {
    const { params } = this.props
    this.fetchItem(params.lessonId)
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
        this.setState({ lesson, lessonLoaded: true })
      } else {
        this.setState({ lessonLoaded: true })
      }
    })
  }

  videoEnded () {
    const { lessonId = '', courseId = '' } = this.props.params
    const { uid } = this.props.auth.user
    console.log(lessonId, uid, courseId)
    firebase.database().ref('users/' + uid)
    .once('value', snapshot => {
      const object = snapshot.val()
      const { userCourses } = object
      console.log(userCourses)
      this.setState({ userCourses })
    })
    .then(() => {
      toastr.success('Your course saved!')
      browserHistory.push(`/admin/courses`)
    })
    // firebase.database().ref('users/' + uid).push({
    //   name, description, mainPhoto, duration, dateUploaded, price, discipline, author, sections, comments
    // })
    // .then(() => {
    //   toastr.success('Your course saved!')
    //   browserHistory.push(`/admin/courses`)
    // })

  }

  renderVideo () {
    const { lesson = {} } = this.state
    if (lesson.videoUrl) {
      return (
        <div>
          <VideoPlayer
            url={lesson.videoUrl}
            videoEnded={this.videoEnded}
          />
        </div>
      )
    }
  }

  renderLesson () {
    const { lesson = {} } = this.state
    return (
      <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
        <div className='col-xs-12 col-md-8'>
  {this.videoEnded()}
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Name:</label>
            <div> {lesson.name}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Video:</label>
            {this.renderVideo()}
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
            <img src={lesson.imageUrl} width='150px' height='100px' />
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
              lessonId={params.id}
            />
          </ul>
        </div>
      </div>
    )
  }
}
MainView.propTypes = {
  params: React.PropTypes.object,
  auth: React.PropTypes.object,
  user: React.PropTypes.object
}

export default MainView

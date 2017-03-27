import React, { Component } from 'react'
import toastr from 'toastr'
import firebase from 'firebase'
import { connectModal, show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import CommentPopupComponent from './CommentPopupComponent'

class CommentList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      comment: '',
      isCommentForLesson: '',
      comments:  ['1']
    }

      this.renderCommentList = this.renderCommentList.bind(this)
  }

  componentWillMount () {
    const { isCommentForLesson, comments } = this.props
    this.setState({ comments })
  }

  componentWillReceiveProps (nextProps) {
  const { isCommentForLesson, comments } = this.props
    this.props.comments !== nextProps.comments &&
    this.setState({ comments })
  }

  // renderLessonPopup (e, item) {
  //   e.preventDefault()
  //   this.props.openModal('lesson', { item })
  // }
  //
  // editLesson = (lesson) => {
  //   const lessonKey = lesson.id
  //   firebase.database().ref('lessons/' + lessonKey).update({
  //     name:lesson.name,
  //     description: lesson.description,
  //     length:  lesson.length,
  //     imageUrl:  lesson.imageUrl,
  //     videoUrl: lesson.videoUrl,
  //     isFree: lesson.isFree,
  //     testId:  lesson.testId,
  //     comments: lesson.comments
  //   })
  //   .then(() => {
  //     const { lessons } = this.state
  //     lessons.map(item => {
  //       if (lessonKey === item.id) {
  //         item.name = lesson.name
  //         item.description = lesson.description
  //         item.length = lesson.length
  //         item.imageUrl = lesson.imageUrl
  //         item.videoUrl = lesson.videoUrl
  //         item.isFree = lesson.isFree
  //         item.testId = lesson.testId
  //         item.comments = lesson.comments
  //         this.setState({lessons})
  //       }
  //     })
  //     this.props.hideModal('lesson')
  //     toastr.success('Your lesson saved!')
  //   })
  // }

  renderCommentList () {
    // const { comments } = this.state
    const comments =['1']

    console.log('cl', comments)
    return  comments.forEach((item, i) =>
    <li key={i}>
      <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >

          <div className='col-xs-10 col-md-6'>

            <div> {item}</div>
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
            <label className='control-label col-xs-2'>Comments:</label>
            <ul className='list-unstyled'>
              {this.renderCommentList()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

CommentList.propTypes = {
  openModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  isCommentForLesson: React.PropTypes.bool,
  comments: React.PropTypes.array
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}

export default connect(
  null,
  mapDispatchToProps
)(CommentList)

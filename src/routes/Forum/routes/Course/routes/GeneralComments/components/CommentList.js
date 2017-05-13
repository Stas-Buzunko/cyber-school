import React, { Component } from 'react'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import CommentPopupComponent from './CommentPopupComponent'

class CommentList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      generalQuestions: [],
      generalQuestionsLoaded: false,
      subSections: {},
      subSectionsLoaded: false,
      lessons: [],
      lessonsLoaded: false,
      comments: []
    }
    this.saveComment = this.saveComment.bind(this)
    this.renderCommentList = this.renderCommentList.bind(this)
  }

  renderCommentPopup (isRespond, item, lessonId) {
    const buttonName = isRespond ? 'Reply' : 'Add Comment'
    return (
      <div>
        <button
          type='button'
          className='btn btn-success lg'
          onClick={(e) => {
            e.preventDefault()
            this.props.openModal('comment', { isRespond, item, lessonId })
          }}>{buttonName}
        </button>
        <CommentPopupComponent
          saveComment={this.saveComment} />
      </div>
    )
  }

  saveComment = (comment, isRespond, item, lessonId) => {
    this.props.saveComment(comment, isRespond, item, lessonId)
  }

  renderChildrenList (item) {
    return item.children.map((child, i) =>
      <div key={i} className='col-xs-12 col-md-12'>
        <div className='col-xs-12 col-md-4'>
          <div className='col-xs-12 col-md-4'>{item.displayName}</div>
          <div className='col-xs-12 col-md-4'><img style={{ borderRadius:'50%' }} src={item.avatar} /> </div>
        </div>
        <div className='col-xs-12 col-md-3'>{child} </div>
      </div>)
  }

  renderCommentList (array, lessonId) {
    const isRespond = true
    return array.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-10 col-md-3'>
            <div className='col-xs-10 col-md-3'>{item.displayName}</div>
            <div className='col-xs-10 col-md-3'><img style={{ borderRadius:'50%' }} src={item.avatar} /> </div>
          </div>
          <div className='col-xs-10 col-md-3' style={{ borderRadius:'50%' }}>{item.text} </div>
          <div className='col-xs-6 col-md-4'>
            {this.renderCommentPopup(isRespond, item, lessonId) }
          </div>
        </div>
        {!!item.children && <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-12 col-md-2'>
          </div>
          <div className='col-xs-10 col-md-8'>
            {this.renderChildrenList(item)}
          </div>
        </div>}
      </li>
    )
  }

  render () {
    const { generalQuestions = [] } = this.props
    const isRespond = false
    return (
      <div className='container'>
        <div className='row'>
          {!!generalQuestions.length &&
            <div className='col-xs-12 col-md-12' style={{ padding: '15px' }}>
              <label className='control-label col-xs-2 col-md-2'>General comments:</label>
              <ul className='list-unstyled'>
                {this.renderCommentPopup(isRespond, {}, '')}
                {this.renderCommentList(generalQuestions, '')}
              </ul>
            </div>
          }
          {!generalQuestions.length &&
            <div className='col-xs-12 col-md-12' style={{ padding: '15px' }}>
              <label className='control-label col-xs-2 col-md-2'>General comments:</label>
              <ul className='list-unstyled'>
                {this.renderCommentPopup(isRespond, {}, '')}
              </ul>
            </div>
          }
        </div>
      </div>
    )
  }
}

CommentList.propTypes = {
  openModal: React.PropTypes.func,
  generalQuestions: React.PropTypes.array,
  saveComment: React.PropTypes.func
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}

export default connect(
  null,
  mapDispatchToProps
)(CommentList)

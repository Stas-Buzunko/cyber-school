import React, { Component } from 'react'
import toastr from 'toastr'
import { connectModal } from 'redux-modal'
import { Modal } from 'react-bootstrap'

class CommentPopupComponent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      comment: '',
      isCommentForLesson: false
    }

    this.saveCommentPopup = this.saveCommentPopup.bind(this)
  }

  saveCommentPopup = () => {
    const { comment } = this.state
    const { isRespond, item, lessonId } = this.props
    this.setState({ error: '' })
    if (!comment) {
      toastr.error('Please, fill your comment')
      return false
    }
    this.props.saveComment(comment, isRespond, item, lessonId)
  }

  render () {
    const { handleHide, show } = this.props
    const { comment } = this.state
    return (
      <Modal
        backdrop={true}
        dialogClassName='login-modal'
        onHide={handleHide}
        show={show}>
        <i className='icon-cross2 modal-close color-white' onClick={handleHide} />
        <Modal.Body>

          <div className='form-group'>
            <label className='control-label col-xs-12'>Comment </label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={comment}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  comment: e.target.value })} />
            </div>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            style={{ width:'50%', margin: '15px' }}
            className='btn btn-success lg'
            onClick={this.saveCommentPopup}
              >Save comment
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
}

CommentPopupComponent.propTypes = {
  show: React.PropTypes.bool,
  handleHide: React.PropTypes.func,
  saveComment: React.PropTypes.func,
  isRespond: React.PropTypes.bool,
  item: React.PropTypes.object,
  lessonId: React.PropTypes.string
}

export default connectModal({
  name: 'comment'
})(CommentPopupComponent)

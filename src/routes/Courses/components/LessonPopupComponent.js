import React, { Component } from 'react'
import toastr from 'toastr'
import { connectModal } from 'redux-modal'
import { Modal } from 'react-bootstrap'

class LessonPopupComponent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      description: '',
      length: '',
      imageUrl: '',
      videoUrl: '',
      isFree: '',
      testId: '',
      comments: '',
      id: '',
      error: ''
    }

    this.saveLessonPopup = this.saveLessonPopup.bind(this)
  }
  componentWillMount () {
    const isNewLesson = this.props.isNewLesson
    const lesson = this.props.item
    if (!isNewLesson) {
      const { name, description, length, imageUrl, videoUrl, isFree, testId, comments, id } = lesson
      this.setState({
        name, description, length, imageUrl, videoUrl, isFree, testId, comments, id
      })
    }
  }
  saveLessonPopup = () => {
    const { name, description, length, imageUrl, videoUrl, isFree, testId, comments, id } = this.state
    this.setState({ error: '' })
    if (!name || !description || !length || !imageUrl || !videoUrl || !isFree || !testId || !comments) {
      if (!name) {
        toastr.error('Please, fill name')
      };
      if (!description) {
        toastr.error('Please, fill description')
      };
      if (!length) {
        toastr.error('Please, fill length')
      };
      if (!imageUrl) {
        toastr.error('Please, fill imageUrl')
      };
      if (!videoUrl) {
        toastr.error('Please, fill videoUrl')
      };
      if (!isFree) {
        toastr.error('Please, fill isFree')
      };
      if (!testId) {
        toastr.error('Please, fill testId')
      };
      if (!comments) {
        toastr.error('Please, fill comments')
      };
      return false
    }
    const lesson = { name, description, length, imageUrl, videoUrl, isFree, testId, comments, id }
    this.props.saveLesson(lesson)
  }

  render () {
    const { handleHide, show } = this.props
    const { name, description, length, imageUrl, videoUrl, isFree, testId, comments } = this.state
    return (
      <Modal
        backdrop={true}
        dialogClassName='login-modal'
        onHide={handleHide}
        show={show}>
        <i className='icon-cross2 modal-close color-white' onClick={handleHide} />
        <Modal.Body>

          <div className='form-group'>
            <label className='control-label col-xs-12'>Name </label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={name}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  name: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-12'>Description </label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={description}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  description: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-12'>Length</label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={length}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  length: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-12'>ImageUrl</label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={imageUrl}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  imageUrl: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-12'>VideoUrl</label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={videoUrl}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  videoUrl: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-12'> isFree </label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={isFree}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  isFree: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-12'>TestId </label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={testId}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  testId: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-12'>Comments </label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={comments}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  comments: e.target.value })} />
            </div>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            style={{ width:'50%', margin: '15px' }}
            className='btn btn-success lg'
            onClick={this.saveLessonPopup}
              >Save lesson
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
}

LessonPopupComponent.propTypes = {
  show: React.PropTypes.bool,
  handleHide: React.PropTypes.func,
  saveLesson: React.PropTypes.func,
  isNewLesson: React.PropTypes.bool,
  item: React.PropTypes.object
}

export default connectModal({
  name: 'lesson'
})(LessonPopupComponent)
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
      isFree: false,
      isBonus: false,
      testId: '',
      task: '',
      id: '',
      error: ''
    }

    this.saveLessonPopup = this.saveLessonPopup.bind(this)
  }
  componentWillMount () {
    const isNewLesson = this.props.isNewLesson
    const lesson = this.props.item
    if (!isNewLesson) {
      const { name, description, length, imageUrl, videoUrl, isFree, isBonus, testId, task, id } = lesson
      this.setState({
        name, description, length, imageUrl, videoUrl, isFree, isBonus, testId, task, id
      })
    }
  }
  saveLessonPopup = () => {
    const { isEditSection } = this.props
    const { name, description, length, imageUrl, videoUrl, isFree, isBonus, testId, task, id } = this.state
    this.setState({ error: '' })
    if (!name || !description || !length || !imageUrl || !videoUrl || !testId || !task) {
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
      if (!testId) {
        toastr.error('Please, fill testId')
      };
      if (!task) {
        toastr.error('Please, fill task')
      };
      return false
    }

    const lesson = { name, description, length, imageUrl, videoUrl, isFree, isBonus, testId, task, id }
    this.props.saveLesson(lesson, isEditSection)
  }

  render () {
    const { handleHide, show } = this.props
    console.log(this.props)
    const { name, description, length, imageUrl, videoUrl, isFree, isBonus, testId, task } = this.state
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
              <label className='checkbox-inline' style={{ paddingBottom: '20px' }}>
                <input type='checkbox' checked={isFree} onChange={(e) =>
                  this.setState({ isFree: !isFree })} />
              </label>
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-12'> isBonus </label>
            <div className='col-xs-10 col-md-6'>
              <label className='checkbox-inline' style={{ paddingBottom: '20px' }}>
                <input type='checkbox' checked={isBonus} onChange={(e) =>
                  this.setState({ isBonus: !isBonus })} />
              </label>
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
            <label className='control-label col-xs-12'>Task </label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={task}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  task: e.target.value })} />
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
  item: React.PropTypes.object,
  isEditSection: React.PropTypes.bool
}

export default connectModal({
  name: 'lesson'
})(LessonPopupComponent)

import React, { Component } from 'react'
import toastr from 'toastr'
import firebase from 'firebase'
import { connectModal } from 'redux-modal'
import { Modal } from 'react-bootstrap'

class LessonComponent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      lesson: {
        name: '',
        description: '',
        length: '',
        imageUrl: '',
        videoUrl: '',
        isFree: '',
        testId: '',
        comments: ''
      },
      error: ''
    }
  }

  saveLesson = () => {
    const { name, description, length, imageUrl, videoUrl, isFree, testId, comments } = this.state

    this.setState({ error: '' })
    firebase.database().ref('lessons/').push({
      name, description, length, imageUrl, videoUrl, isFree, testId, comments
    })
    .then(() => {
      toastr.success('Your lesson saved!')
    })
  }

  render () {
    const { handleHide, show } = this.props

    return (
      <Modal
        backdrop
        dialogClassName='login-modal'
        onHide={handleHide}
        show={show}>
        <i className='icon-cross2 modal-close color-white' onClick={handleHide} />
        <Modal.Body>
          <div className='form-group'>
            <label className='control-label col-xs-2'>Description </label>
            <div className='col-xs-10 col-md-6'>
              <input
                type='text'
                className='form-control'
                onChange={(e) => this.setState({ description: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-2'>Length</label>
            <div className='col-xs-10 col-md-6'>
              <input type='text'
                className='form-control'
                onChange={(e) => this.setState({ length: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-2'>ImageUrl</label>
            <div className='col-xs-10 col-md-6'>
              <input type='text' className='form-control' onChange={(e) => this.setState({
                imageUrl: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-2'>VideoUrl</label>
            <div className='col-xs-10 col-md-6'>
              <input type='text' className='form-control' onChange={(e) => this.setState({
                videoUrl: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-2'> isFree </label>
            <div className='col-xs-10 col-md-6'>
              <input type='text' className='form-control' onChange={(e) => this.setState({
                isFree: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-2'>TestId </label>
            <div className='col-xs-10 col-md-6'>
              <input type='text' className='form-control' onChange={(e) => this.setState({
                testId: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-2'>Comments </label>
            <div className='col-xs-10 col-md-6'>
              <input type='text' className='form-control' onChange={(e) => this.setState({
                comments: e.target.value })} />
            </div>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            style={{ width:'50%', margin: '15px' }}
            className='btn btn-success lg'
            onClick={this.saveLesson}
              >Save lesson
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connectModal({
  name: 'lesson'
})(LessonComponent)

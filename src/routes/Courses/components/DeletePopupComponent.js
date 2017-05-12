import React, { Component } from 'react'
import { connectModal } from 'redux-modal'
import { Modal } from 'react-bootstrap'

class DeletePopupComponent extends Component {
  constructor (props) {
    super(props)
    this.delete = this.delete.bind(this)
  }

  delete = () => {
    const { id, type, questionNumber } = this.props
    if (type === 'question') {
      this.props.deleteQuestion(questionNumber)
    } else {
      this.props.deleteItem(id, type)
    }
  }

  render () {
    const { handleHide, show } = this.props
    return (
      <Modal
        backdrop={true}
        dialogClassName='login-modal'
        onHide={handleHide}
        show={show}>
        <i className='icon-cross2 modal-close color-white' onClick={handleHide} />
        <Modal.Body>
          <div className='form-group'>
            <label className='control-label col-xs-12'>Delete? </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            style={{ width:'50%', margin: '15px' }}
            className='btn btn-success lg'
            onClick={this.delete}
              >Delete
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
}

DeletePopupComponent.propTypes = {
  show: React.PropTypes.bool,
  handleHide: React.PropTypes.func,
  id: React.PropTypes.string,
  deleteItem: React.PropTypes.func,
  type: React.PropTypes.string,
  deleteQuestion: React.PropTypes.func,
  questionNumber: React.PropTypes.number
}

export default connectModal({
  name: 'delete'
})(DeletePopupComponent)

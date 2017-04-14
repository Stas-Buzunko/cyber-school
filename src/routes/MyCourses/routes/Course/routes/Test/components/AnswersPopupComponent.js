import React, { Component } from 'react'
import { connectModal } from 'redux-modal'
import { Modal } from 'react-bootstrap'

class AnswersPopupComponent extends Component {
  constructor (props) {
    super(props)



    // this.closeAnswerPopup = this.closeAnswerPopup.bind(this)
  }
  closePopup (isAllTestPassed) {
    // this.props.closeAnswerPopup(isAllTestPassed)
  }

  render () {
    const { handleHide, show } = this.props
    const { rightUserAnswers, numberOfQuestions } = this.props
    const isAllTestPassed = rightUserAnswers === numberOfQuestions
    return (
      <Modal
        backdrop={true}
        dialogClassName='login-modal'
        onHide={handleHide}
        show={show}>
        <i className='icon-cross2 modal-close color-white' onClick={handleHide} />
        <Modal.Body>

          <div className='col-xs-10 col-md-12'>
            { isAllTestPassed && <div>
              <h3>Congratulations!!!</h3>
              <h3>All yours answers are correct!</h3>
              <h3>{rightUserAnswers} from {numberOfQuestions} </h3>
            </div>}
            { !isAllTestPassed && <div>
              <h3>You have {rightUserAnswers} from {numberOfQuestions}
                right answers!</h3>
              </div>}
          </div>

        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            style={{ width:'50%', margin: '15px' }}
            className='btn btn-success lg'
            onClick={this.props.closeAnswerPopup}
              >Close
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
}

AnswersPopupComponent.propTypes = {
  show: React.PropTypes.bool,
  handleHide: React.PropTypes.func,
  closeAnswerPopup: React.PropTypes.func,
  rightUserAnswers: React.PropTypes.number,
  numberOfQuestions: React.PropTypes.number
}

export default connectModal({
  name: 'answer'
})(AnswersPopupComponent)

import React, { Component } from 'react'
import toastr from 'toastr'
import { connectModal } from 'redux-modal'
import { Modal } from 'react-bootstrap'

class QuestionPopupComponent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      question:'',
      text: '',
      answers: [],
      rightAnswers: []
    }

    this.saveQuestionPopup = this.saveQuestionPopup.bind(this)
  }
  componentWillMount () {
    const isNewQuestion = this.props.isNewQuestion
    const question = this.props.question
    if (!isNewQuestion) {
      const { text, answers, rightAnswers } = question
      this.setState({
        text, answers, rightAnswers
      })
    }
  }
  saveQuestionPopup = () => {
    const { text, answers, rightAnswers } = this.state
    this.setState({ error: '' })
    if (!text || !answers || !rightAnswers) {
      if (!text) {
        toastr.error('Please, fill question text')
      };
      if (!answers) {
        toastr.error('Please, add one answer')
      };
      if (!rightAnswers) {
        toastr.error('Please, add right answer')
      };
      return false
    }
    const question = { text, answers, rightAnswers }
    this.props.saveQuestion(question)
    this.setState({
      text: '',
      answers: [],
      rightAnswers: []
    })
  }

  render () {
    const { handleHide, show } = this.props
    const { text, answers, rightAnswers } = this.state
    return (
      <Modal
        backdrop={true}
        dialogClassName='login-modal'
        onHide={handleHide}
        show={show}>
        <i className='icon-cross2 modal-close color-white' onClick={handleHide} />
        <Modal.Body>

          <div className='form-group'>
            <label className='control-label col-xs-12'>Question text</label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={text}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  text: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-12'>Answers </label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={answers}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  answers: e.target.value })} />
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-12'>Right Answers</label>
            <div className='col-xs-10 col-md-6'>
              <input
                value={rightAnswers}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  rightAnswers: e.target.value })} />
            </div>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <button
            type='button'
            style={{ width:'50%', margin: '15px' }}
            className='btn btn-success lg'
            onClick={this.saveQuestionPopup}
              >Save Question
          </button>
        </Modal.Footer>
      </Modal>
    )
  }
}

QuestionPopupComponent.propTypes = {
  show: React.PropTypes.bool,
  handleHide: React.PropTypes.func,
  isNewQuestion: React.PropTypes.bool,
  saveQuestion: React.PropTypes.func,
  question: React.PropTypes.object

}

export default connectModal({
  name: 'question'
})(QuestionPopupComponent)

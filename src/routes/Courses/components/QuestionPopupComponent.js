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
      answer1: '',
      isRightAnswer1: true,
      answer2: '',
      isRightAnswer2: false,
      answer3: '',
      isRightAnswer3: false,
      answer4: '',
      isRightAnswer4: false,
      rightAnswers: []
    }

    this.saveQuestionPopup = this.saveQuestionPopup.bind(this)
  }
  componentWillMount () {
    const isNewQuestion = this.props.isNewQuestion
    console.log('isNewQuestion',isNewQuestion)
    if (!isNewQuestion) {
      const { text, questionNumber = 0, answers } = this.props.question
      this.setState({
        questionNumber,
        text,
        answer1: answers[0].answer,
        isRightAnswer1: answers[0].isRight,
        answer2: answers[1].answer,
        isRightAnswer2: answers[1].isRight,
        answer3:answers[2].answer,
        isRightAnswer3: answers[2].isRight,
        answer4: answers[3].answer,
        isRightAnswer4: answers[3].isRight
      })
    }
  }
  saveQuestionPopup = () => {
    const { questionNumber = 0 } = this.props
    const { text, answer1, isRightAnswer1, answer2, isRightAnswer2, answer3, isRightAnswer3,
    answer4, isRightAnswer4 } = this.state
    this.setState({ error: '' })
    const isOneAnswer = (answer1.length || answer2.length || answer3.length || answer4.length)
    const haveRightAnswer = (isRightAnswer1 || isRightAnswer2 || isRightAnswer3 || isRightAnswer4)
    if (!text || !isOneAnswer || !haveRightAnswer) {
      if (!text) {
        toastr.error('Please, fill question text')
      };
      if (!isOneAnswer) {
        toastr.error('Please, add one answer')
      };
      if (!haveRightAnswer) {
        toastr.error('Please, add right answer')
      };
      return false
    }
    const question = {
      questionNumber,
      text,
      answers: [
        { answer: answer1, isRight: isRightAnswer1 },
        { answer: answer2, isRight: isRightAnswer2 },
        { answer: answer3, isRight: isRightAnswer3 },
        { answer: answer4, isRight: isRightAnswer4 }
      ]
    }
    this.props.saveQuestion(question)
    this.setState({
      text: '',
      answer1: '',
      isRightAnswer1: true,
      answer2: '',
      isRightAnswer2: false,
      answer3: '',
      isRightAnswer3: false,
      answer4: '',
      isRightAnswer4: false
    })
  }
  renderAnswers = () => {
    const { answer1, answer2, answer3, answer4,
    isRightAnswer1, isRightAnswer2, isRightAnswer3, isRightAnswer4 } = this.state
    return (
      <div>
        <div className='col-md-12'>
          <label className='control-label col-xs-1'>1</label>
          <div className='col-xs-10 col-md-9'>
            <input
              value={answer1}
              type='text'
              className='form-control'
              onChange={(e) => this.setState({
                answer1: e.target.value })} />
          </div>
          <div className='col-xs-10 col-md-2'>
            <label className='checkbox-inline' style={{ paddingBottom: '20px' }}>
              <input type='checkbox' checked={isRightAnswer1} onChange={(e) =>
                this.setState({ isRightAnswer1: !isRightAnswer1 })} />
            </label>
          </div>
        </div>

        <div className='col-md-12'>
          <label className='control-label col-xs-1'>2</label>
          <div className='col-xs-10 col-md-9'>
            <input
              value={answer2}
              type='text'
              className='form-control'
              onChange={(e) => this.setState({
                answer2: e.target.value })} />
          </div>
          <div className='col-xs-10 col-md-2'>
            <label className='checkbox-inline' style={{ paddingBottom: '20px' }}>
              <input type='checkbox' checked={isRightAnswer2} onChange={(e) =>
                this.setState({ isRightAnswer2: !isRightAnswer2 })} />
            </label>
          </div>
        </div>

        <div className='col-md-12'>
          <label className='control-label col-xs-1'>3</label>
          <div className='col-xs-10 col-md-9'>
            <input
              value={answer3}
              type='text'
              className='form-control'
              onChange={(e) => this.setState({
                answer3: e.target.value })} />
          </div>
          <div className='col-xs-10 col-md-2'>
            <label className='checkbox-inline' style={{ paddingBottom: '20px' }}>
              <input type='checkbox' checked={isRightAnswer3} onChange={(e) =>
                this.setState({ isRightAnswer3: !isRightAnswer3 })} />
            </label>
          </div>
        </div>

        <div className='col-md-12'>
          <label className='control-label col-xs-1'>4</label>
          <div className='col-xs-10 col-md-9'>
            <input
              value={answer4}
              type='text'
              className='form-control'
              onChange={(e) => this.setState({
                answer4: e.target.value })} />
          </div>
          <div className='col-xs-10 col-md-2'>
            <label className='checkbox-inline' style={{ paddingBottom: '20px' }}>
              <input type='checkbox' checked={isRightAnswer4} onChange={(e) =>
                this.setState({ isRightAnswer4: !isRightAnswer4 })} />
            </label>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { handleHide, show } = this.props
    const { text } = this.state
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
            <div className='col-xs-10 col-md-12'>
              <input
                value={text}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  text: e.target.value })} />
                </div>
              </div>

          <div className='form-group'>
            <label className='control-label col-md-9'>Answers </label>
            <label className='control-label col-md-3'>Right answer </label>
            <div className='col-xs-10 col-md-12'>
              <ul className='list-unstyled'>
                {this.renderAnswers()}
              </ul>
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
  question: React.PropTypes.object,
  questionNumber: React.PropTypes.number

}

export default connectModal({
  name: 'question'
})(QuestionPopupComponent)

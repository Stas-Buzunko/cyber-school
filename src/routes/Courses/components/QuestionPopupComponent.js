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
      answers: ['', '', '', ''],
      rightAnswers: [0],
      newAnswer: '',
      test: {
        name: '',
        questions: [
          {
            text: '',
            answers: {},
            rightAnswers: [],
            userAnswers:[],
            textIfRight: ''
          }
        ]
      }

    }

    this.saveQuestionPopup = this.saveQuestionPopup.bind(this)
  }

  componentWillMount () {
    const { isNewQuestion } = this.props
    if (!isNewQuestion) {
      const { text, questionNumber, answers, rightAnswers, textIfRight = '' } = this.props.question
      this.setState({
        questionNumber,
        text,
        answers,
        rightAnswers,
        textIfRight
      })
    }
  }

  saveQuestionPopup = () => {
    const { questionNumber, isNewQuestion } = this.props
    const { text, answers, rightAnswers, textIfRight } = this.state
    this.setState({ error: '' })
    const isOneAnswer = answers.length
    const haveRightAnswer = rightAnswers.length
    if (!text || !isOneAnswer || !haveRightAnswer || !textIfRight) {
      if (!text) {
        toastr.error('Please, fill question text')
      };
      if (!isOneAnswer) {
        toastr.error('Please, add one answer')
      };
      if (!haveRightAnswer) {
        toastr.error('Please, add right answer')
      };
      if (!textIfRight) {
        toastr.error('Please, add right answer text')
      };
      return false
    }
    const question = {
      questionNumber,
      text,
      answers,
      rightAnswers,
      textIfRight
    }
    this.props.saveQuestion(question, isNewQuestion)
    this.setState({
      text: '',
      answers: ['', '', '', ''],
      rightAnswers: [0],
      textIfRight:''
    })
  }

  answerChange (answer, i) {
    const { answers } = this.state
    const newArray = [
      ...answers.slice(0, i),
      answer,
      ...answers.slice(i + 1)
    ]
    this.setState({
      answers: newArray
    })
  }

  addAnswerButton () {
    const { answers } = this.state
    return (
      <button
        type='button'
        style={{ width:'20%', margin: '15px' }}
        className='btn btn-success lg'
        onClick={() => this.answerChange('', answers.length)}
        >Add Answer
      </button>
    )
  }

  isRightAnswer (i) {
    const { rightAnswers } = this.state
    const index = rightAnswers.indexOf(i)
    if (index === -1) {
      return false
    } else {
      return true
    }
  }

  checkboxChange (i) {
    const { rightAnswers } = this.state
    const indexOfAnswer = rightAnswers.indexOf(i)
    if (indexOfAnswer >= 0) {
      rightAnswers.splice(indexOfAnswer, 1)
    } else {
      rightAnswers.push(i)
    }
    this.setState({
      rightAnswers
    })
  }

  renderAnswers = () => {
    const { answers } = this.state
    return (
      <div>
        {answers.map((item, i) =>
          <li key={i}>
            <div className='col-md-12'>
              <label className='control-label col-xs-1'>{i + 1}</label>
              <div className='col-xs-10 col-md-9'>
                <input
                  value={item}
                  type='text'
                  className='form-control'
                  onChange={(e) => this.answerChange(e.target.value, i)} />
              </div>
              <div className='col-xs-10 col-md-2'>
                <label className='checkbox-inline' style={{ paddingBottom: '20px' }}>
                  <input
                    type='checkbox'
                    checked={this.isRightAnswer(i)}
                    onChange={() =>
                      this.checkboxChange(i)} />
                </label>
              </div>
            </div>
          </li>
        )}
      </div>
    )
  }

  render () {
    const { handleHide, show } = this.props
    const { text, textIfRight } = this.state
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
            <div className='col-xs-10 col-md-12'>
              {this.addAnswerButton()}
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label col-xs-12'>Right answer text</label>
            <div className='col-xs-10 col-md-12'>
              <input
                value={textIfRight}
                type='text'
                className='form-control'
                onChange={(e) => this.setState({
                  textIfRight: e.target.value })} />
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

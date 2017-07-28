import React, { Component } from 'react'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import QuestionPopupComponent from './QuestionPopupComponent'
import toastr from 'toastr'
import DeletePopupComponent from './DeletePopupComponent'

class QuestionsList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      questions: [],
      question: []
    }
    this.renderAnswers = this.renderAnswers.bind(this)
    this.deleteQuestion = this.deleteQuestion.bind(this)
  }

  editQuestion = (question, isNewQuestion) => {

    const { questions = [], test } = this.props

    if (isNewQuestion) {
      const newArray = [
        ...questions, question
      ]
        this.setState({ questions: newArray })
        this.props.editQuestionsInTest(newArray, test)
    } else {
      const indexItemToRemove = questions.findIndex(item => question.questionNumber === item.questionNumber)
      const newArray = [
        ...questions.slice(0, indexItemToRemove),
        question,
        ...questions.slice(indexItemToRemove + 1)
      ]
        this.setState({ questions: newArray })
        this.props.editQuestionsInTest(newArray, test)
    }
    this.props.hideModal('question')

    toastr.success('Your question saved!')
  }

  renderQuestionPopup (question, isNewQuestion, questionNumber) {
    console.log(question)
    this.props.openModal('question', { question, isNewQuestion, questionNumber })
  }

  renderDelete (question) {
    const questionNumber = question.questionNumber
    const type = 'question'
    this.props.openModal('delete', { questionNumber, type })
  }

  deleteQuestion = (questionNumber) => {
    const { questions = [], test } = this.props
    const indexItemToRemove = questions.findIndex(item => questionNumber === item.questionNumber)
    const newArray = [
      ...questions.slice(0, indexItemToRemove),
      ...questions.slice(indexItemToRemove + 1)
    ]
    this.setState({ questions: newArray })
    this.props.hideModal('question')
    this.props.editQuestionsInTest(newArray, test)
    toastr.success('Your question deleted!')
  }

  isRightAnswer (i, rightAnswers) {
    const index = rightAnswers.indexOf(i)
    if (index === -1) {
      return false
    } else {
      return true
    }
  }

  renderAnswers (answers, rightAnswers) {
    return answers.map((item, i) =>
      <li key={i}>
        <div className='col-md-12'>
          <label className='col-md-1'>{i + 1}</label>
          <div className='col-xs-10 col-md-9'>
            {item}
          </div>
          <div className='col-xs-10 col-md-2'>
          <label className='checkbox-inline' style={{ paddingBottom: '20px' }}>
            <input type='checkbox' checked={this.isRightAnswer(i, rightAnswers)} />
          </label>
        </div>
        </div>
      </li>
  )
  }
  renderQuestionsList () {
    const { isTestEdit, questions = [] } = this.props
    let isNewQuestion
    return questions.map((item, i) =>
      <li key={i}>

        <div style={{ padding: '15px' }} >


            <div className='col-md-12'>
              <label className='col-md-3'>Question:</label>
              <div className='col-md-6'> {item.text}</div>
            </div>

            {!isTestEdit &&
              <div>
                <label className='control-label'>Answers:</label>
                <ul className='list-unstyled'>
                  <div> {this.renderAnswers(item.answers, item.rightAnswers)}</div>
                </ul>
              </div>
            }

            {!!isTestEdit &&
              <div className='col-xs-12 col-md-4' style={{ padding: '15px' }}>
                <button
                  type='button'
                  className='btn btn-primary lg'
                  onClick={(e) => { this.renderQuestionPopup(item, isNewQuestion = false, item.questionNumber) }}
                  >Edit Question
                </button>
                <button
                  type='button'
                  className='btn btn-primary lg'
                  onClick={(e) => { this.renderDelete(item) }}
                  >Delete Question
                </button>

                <QuestionPopupComponent
                  saveQuestion={this.editQuestion}
                  isNewQuestion={false}
                />
                <DeletePopupComponent
                  deleteQuestion={this.deleteQuestion}
                />
              </div>
            }

        </div>
      </li>
    )
  }
  render () {
    const { isTestEdit, questions = [] } = this.props
    const questionNumber = questions.length
    let isNewQuestion
    let question = {}
    return (
            <ul className='list-unstyled'>
              {this.renderQuestionsList()}
              {!!isTestEdit && <div className='col-xs-12 col-md-12' style={{ padding: '15px' }}>
                <button
                type='button'
                className='btn btn-primary lg'
                onClick={(e) => { this.renderQuestionPopup(question, isNewQuestion = true, questionNumber) }}
                >New Question
              </button>
              <QuestionPopupComponent
                saveQuestion={this.editQuestion}
                isNewQuestion={false}
              />
            </div> }
            </ul>
    )
  }
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}
QuestionsList.propTypes = {
  openModal: React.PropTypes.func,
  questions: React.PropTypes.array,
  hideModal: React.PropTypes.func,
  isTestEdit: React.PropTypes.bool,
  editQuestionsInTest: React.PropTypes.func,
  test: React.PropTypes.object
}

export default connect(
  null,
  mapDispatchToProps
)(QuestionsList)

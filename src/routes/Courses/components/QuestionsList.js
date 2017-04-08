import React, { Component } from 'react'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import QuestionPopupComponent from './QuestionPopupComponent'
import toastr from 'toastr'

class QuestionsList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      questions: [],
      question: []
    }
    this.renderAnswers = this.renderAnswers.bind(this)
  }
  editQuestion = (question) => {
    const { questions = [], test } = this.props
    const indexItemToRemove = questions.findIndex(item => question.questionNumber === item.questionNumber)
    const newArray = [
      ...questions.slice(0, indexItemToRemove),
      question,
      ...questions.slice(indexItemToRemove + 1)
    ]
    this.setState({ questions: newArray })
    this.props.hideModal('question')
    this.props.editQuestionsInTest(newArray, test)
    toastr.success('Your question saved!')
  }
  renderQuestionPopup (question) {
    this.props.openModal('question', { question })
  }

  renderAnswers (answers) {
    return answers.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-md-12'>
            <label className='control-label col-xs-1'>{i + 1}</label>
            <div className='col-xs-10 col-md-9'>
              {item.answer}
            </div>
            <div className='col-xs-10 col-md-2'>
              <label className='checkbox-inline' style={{ paddingBottom: '20px' }}>
                <input type='checkbox' checked={item.isRight} />
              </label>
            </div>
          </div>
        </div>
      </li>
  )
  }
  renderQuestionsList () {
    const { isTestEdit, questions = [] } = this.props
    return questions.map((item, i) =>
      <li key={i}>

        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-12 col-md-8'>

            <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Question:</label>
              <div> {item.text}</div>
            </div>

            {!isTestEdit &&
              <div className='col-xs-10'>
                <label className='control-label col-xs-2'>Answers:</label>
                <ul className='list-unstyled'>
                  <div> {this.renderAnswers(item.answers)}</div>
                </ul>
              </div>
            }

            {!!isTestEdit &&
              <div className='col-xs-12 col-md-4'>
                <button
                  type='button'
                  className='btn btn-primary lg'
                  onClick={(e) => { this.renderQuestionPopup(item) }}
                  >Edit Question
                </button>
                <QuestionPopupComponent
                  saveQuestion={this.editQuestion}
                  isNewQuestion={false}
                />
              </div>
            }
          </div>
        </div>
      </li>
    )
  }
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              {this.renderQuestionsList()}
            </ul>
          </div>
        </div>
      </div>
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

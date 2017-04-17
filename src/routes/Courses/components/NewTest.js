import React, { Component } from 'react'
import QuestionsList from './QuestionsList'
import toastr from 'toastr'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import QuestionPopupComponent from './QuestionPopupComponent'

class TestList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      test: '',
      tests: [],
      questions: [],
      name: '',
      testsLoaded: false,
      isTestEdit: false
    }

    this.saveQuestion = this.saveQuestion.bind(this)
    this.saveNewTest = this.saveNewTest.bind(this)
    this.renderQuestionPopup = this.renderQuestionPopup.bind(this)
    this.renderNewTest = this.renderNewTest.bind(this)
  }

  saveNewTest () {
    const { questions, name } = this.state
    const test = { name, questions }
    this.props.saveTest(test)
    this.setState({
      name: '',
      questions: []
    })
  }

  saveQuestion = (question) => {
    const { questions = [] } = this.state
    const newQuestions = [ ...questions, question ]
    this.setState({ questions: newQuestions })
    this.props.hideModal('question')
    toastr.success('Your question saved!')
  }

  renderQuestionPopup () {
    const isNewQuestion = true
    return (
      <div>
        <button
          type='button'
          className='btn btn-success lg'
          onClick={(e) => {
            e.preventDefault()
            this.props.openModal('question', { isNewQuestion })
          }}>Add Question
        </button>
      </div>
    )
  }
  renderNewTest () {
    const { questions = [], name } = this.state
    return (
      <div className='col-xs-12 col-md-12'>
        <div className='col-xs-12 col-md-12'>
          <label className='control-label col-xs-2 col-md-3'>Test name: </label>
          <div className='col-xs-6 col-md-3'>
            <input
              value={name}
              type='text'
              className='form-control'
              onChange={(e) => this.setState({ name: e.target.value })} />
          </div>
          <div className='col-xs-6 col-md-3'>
            <button
              type='button'
              className='btn btn-success lg'
              onClick={(e) => { this.saveNewTest() }}
              >Save test
            </button>
          </div>
        </div>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <label className='col-xs-2 col-md-3'>Questions: </label>
          <div className='col-xs-2 col-md-9'>
            <ul className='list-unstyled'>
              {this.renderQuestionPopup()}
            </ul>
            <QuestionPopupComponent
              saveQuestion={this.saveQuestion}
              isNewQuestion={true}
              questionNumber={this.state.questions.length}
            />
          </div>
        </div>
        <div className='col-xs-2 col-md-4'>
          <QuestionsList
            questions={questions}
          />
        </div>
      </div>
    )
  }
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              { this.renderNewTest() }
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

TestList.propTypes = {
  openModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  testsIds: React.PropTypes.array,
  isNewTest: React.PropTypes.bool,
  saveTest: React.PropTypes.func
}
export default connect(
  null,
  mapDispatchToProps
)(TestList)

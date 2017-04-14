import React, { Component } from 'react'
import firebase from 'firebase'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import AnswersPopupComponent from './AnswersPopupComponent'
import toastr from 'toastr'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      testLoaded: false,
      userQuestions: [],
      rightUserAnswers: 0,
      test: {
        name: '',
        questions: [
          {
            text: '',
            answers: [],
            rightAnswers: [],
            userAnswers: []
          }
        ]
      }
    }
    this.closeAnswerPopup = this.closeAnswerPopup.bind(this)
    this.onCheckBoxClick = this.onCheckBoxClick.bind(this)
    this.countRightUserAnswers = this.countRightUserAnswers.bind(this)
    this.closeAnswerPopup = this.closeAnswerPopup.bind(this)
    this.renderButtonSaveTestAnswers = this.renderButtonSaveTestAnswers.bind(this)
  }

  componentWillMount () {
    const { params } = this.props
    this.fetchItem(params.id[1])
  }

  fetchItem (id) {
    this.setState({
      test: [],
      testLoaded: false
    })
    firebase.database().ref('tests/' + id)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const test = object
        test.id = id
        const userQuestions = test.questions
        userQuestions.forEach(item => {
          item.userAnswers = []
        })
        this.setState({ test, userQuestions, testLoaded: true })
      } else {
        this.setState({ testLoaded: true })
      }
    })
  }

  onCheckBoxClick (question, i) {
    const { test = {}, userQuestions } = this.state
    const { questions } = test
    const indexItemToRemove = userQuestions.findIndex(item => question.text === item.text)
    const newUserAnswers = userQuestions[indexItemToRemove].userAnswers
    const indexOfAnswer = newUserAnswers.indexOf(i)
    if (indexOfAnswer === -1) {
      newUserAnswers.push(i)
    } else {
      newUserAnswers.splice(indexOfAnswer, 1)
    }
    const { text, answers, rightAnswers } = questions[indexItemToRemove]
    const userAnswers = newUserAnswers
    const newQuestion = { text, answers, rightAnswers, userAnswers }
    const newArrayQuestions = [
      ...userQuestions.slice(0, indexItemToRemove),
      newQuestion,
      ...userQuestions.slice(indexItemToRemove + 1)
    ]
    this.setState({
      userQuestions:newArrayQuestions
    })
  }

  renderAnswers (question) {
    return (
      <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
        {question.answers.map((item, i) =>
          <div key={i}>
            <div className='col-md-12'>
              <label className='control-label col-xs-1 col-md-3'>{ i + 1 }</label>
              <div className='col-xs-10 col-md-6'>
                {item}
              </div>
              <div className='col-xs-10 col-md-3'>
                <label className='checkbox-inline' style={{ paddingBottom: '20px' }}>
                  <input
                    type='checkbox'
                    onChange={() =>
                      this.onCheckBoxClick(question, i)} />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  countRightUserAnswers () {
    const { userQuestions = [] } = this.state
    let newRightUserAnswers = 0
    userQuestions.forEach(item => {
      const isRightAnswer = JSON.stringify(item.userAnswers) === JSON.stringify(item.rightAnswers)
      if (isRightAnswer) {
        newRightUserAnswers = newRightUserAnswers + 1
      }
    })
    return newRightUserAnswers
  }
  closeAnswer() {
    const { userQuestions = [] } = this.state
    const { params } = this.props
    const rightUserAnswers = this.countRightUserAnswers()
    const isAllTestPassed = rightUserAnswers === userQuestions.length
    if (isAllTestPassed) {
      browserHistory.push({ pathname : `/myCourses/course/${params.id[0]}` })
    } else {
      toastr.success('Would you like to try one more time?')
    }
    const NewUserQuestions = userQuestions
    NewUserQuestions.forEach(item => {
      item.userAnswers = []
    })
    this.setState({ userQuestions: NewUserQuestions, rightUserAnswers: 0 })
  }

  closeAnswerPopup() {
    this.props.hideModal('answer')
    this.closeAnswer()
  }

  renderButtonSaveTestAnswers () {
    const { userQuestions } = this.state
    const numberOfQuestions = userQuestions.length
    const rightUserAnswers = this.countRightUserAnswers()

    return (
      <div>
        <button
          type='button'
          className='btn btn-success lg'
          onClick={(e) => {
            e.preventDefault()
            this.props.openModal('answer')
          }}>Save
        </button>

        <AnswersPopupComponent
          closeAnswerPopup={this.closeAnswerPopup}
          rightUserAnswers={rightUserAnswers}
          numberOfQuestions={numberOfQuestions}
          />

      </div>
    )
  }
  render () {
    const { questions = [], name } = this.state.test
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-8'>
            <label className='control-label col-xs-2'>Name:</label>
            <div> {name}</div>
          </div>
          <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              {questions.map((item, i) =>
                <li key={i}>
                  <div className='col-md-12'>
                    <label className='control-label col-xs-2'>Question {i + 1}</label>
                    <div className='col-xs-10 col-md-10'>
                      {item.text}
                    </div>
                  </div>
                  {this.renderAnswers(item)}
                </li>
              )}
            </ul>
          </div>
          <div className='col-xs-12 col-md-8'>
            {this.renderButtonSaveTestAnswers()}
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

MainView.propTypes = {
  openModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  params: React.PropTypes.object
}

export default connect(
  null,
  mapDispatchToProps
)(MainView)

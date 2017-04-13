import React, { Component } from 'react'
import firebase from 'firebase'
import QuestionPopupComponent from './QuestionPopupComponent'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      testLoaded: false,
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
        this.setState({ test, testLoaded: true })
      } else {
        this.setState({ testLoaded: true })
      }
    })
  }

  onCheckBoxClick (question, i) {
    const { test = {} } = this.state
    const { questions, name } = test
    const indexItemToRemove = questions.findIndex(item => question.text === item.text)
    const newUserAnswers = questions[indexItemToRemove].userAnswers
    const indexOfAnswer = newUserAnswers.indexOf(item => item === i)
    if (indexOfAnswer >= 0) {
      newUserAnswers.splice(indexOfAnswer, 1)
    } else {
      newUserAnswers.push(i)
    }
    const { text, answers, rightAnswers } = questions[indexItemToRemove]
    const newQuestion = { text, answers, rightAnswers, newUserAnswers }
    const newArrayQuestions = [
      ...questions.slice(0, indexItemToRemove),
      newQuestion,
      ...questions.slice(indexItemToRemove + 1)
    ]
    const newTest = { name, newArrayQuestions }
    this.setState({
      test: newTest
    })
  }

  renderAnswers (question) {
    return (
      <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
        {question.answers.map((item, i) =>
          <li key={i}>

            <div className='col-md-12'>
              <label className='control-label col-xs-1'>{ i + 1 }</label>
              <div className='col-xs-10 col-md-9'>
                {item}
              </div>
              <div className='col-xs-10 col-md-2'>
                <label className='checkbox-inline' style={{ paddingBottom: '20px' }}>
                  <input
                    type='checkbox'
                    onChange={ () =>
                      onCheckBoxClick(question, i)} />
                    </label>
                  </div>
                </div>
              </li>
            )}
          </div>
        )
      }

  render () {
    const { test = {} } = this.state
    const { params } = this.props
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-8'>
            <label className='control-label col-xs-2'>Name:</label>
            <div> {test.name}</div>
          </div>
          <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              {test.questions.map((item, i) =>
                <li key={i}>
                  <div className='col-md-12'>
                    <label className='control-label col-xs-1'>Question {i+1}</label>
                    <div className='col-xs-10 col-md-9'>
                      {item.text}
                    </div>
                  </div>
                  {this.renderAnswers(item)}
                </li>
              )}
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

MainView.propTypes = {
  openModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  params: React.PropTypes.object
}

export default connect(
  null,
  mapDispatchToProps
)(MainView)

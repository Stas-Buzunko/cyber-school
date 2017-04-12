import React, { Component } from 'react'
import firebase from 'firebase'
import QuestionPopupComponent from './QuestionPopupComponent'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      test: [],
      testLoaded: false,
      userAnswers: [],
      answer1: '',
      isRightAnswer1: false,
      answer2: '',
      isRightAnswer2: false,
      answer3: '',
      isRightAnswer3: false,
      answer4: '',
      isRightAnswer4: false
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

test {
  name
  questions [
    {
    text
    answers []
    rightAnswers []
    userAnswers []
  }
  ]
}
  onCheckBoxClick (question, i) {
    const { test = {} } = this.state
    const indexItemToRemove = test.questions.findIndex(item => question.text === item.text)
    const newUserAnswers = test.questions[indexItemToRemove].userAnswers
    const indexOfAnswer = newUserAnswers.indexOf(item => item === i)
    if (!!indexOfAnswer) {
      newUserAnswers.splice(indexOfAnswer, 1 )
    } else {
      newUserAnswers.push(i)
    }
    const newUserAnswers
    
     test.questions.
     const newArray = [
       ...questions.slice(0, indexItemToRemove),
       section,
       ...questions.slice(indexItemToRemove + 1)
     ]
    // check if option is already in
    // if chosen = remove
    // if not chosen = add
    setState({
    const newUserAnswers: [
        ...answers, i
      ]
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

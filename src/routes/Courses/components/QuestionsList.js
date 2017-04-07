import React, { Component } from 'react'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'

class QuestionsList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      questions: [],
      question: []
    }
    this.renderAnswers = this.renderAnswers.bind(this)
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
    const { isNewTest, questions = [] } = this.props
    return questions.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-12 col-md-8'>

            <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Question:</label>
              <div> {item.text}</div>
            </div>
            <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Answers:</label>
              <div> {this.renderAnswers(item.answers)}</div>
            </div>
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

QuestionsList.propTypes = {
  openModal: React.PropTypes.func,
  questions: React.PropTypes.array,
  isNewTest: React.PropTypes.bool,
  hideModal: React.PropTypes.func
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}

export default connect(
  null,
  mapDispatchToProps
)(QuestionsList)

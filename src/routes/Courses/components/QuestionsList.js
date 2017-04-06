import React, { Component } from 'react'
import toastr from 'toastr'
import firebase from 'firebase'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import QuestionPopupComponent from './QuestionPopupComponent'

class QuestionsList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      questions: [],
      question: []
    }
  }

  renderTestPopup (e, item) {
    e.preventDefault()
    this.props.openModal('test', { item })
  }

  edittest = (test) => {
    const testKey = test.id
    const { name, description, length, imageUrl, videoUrl, isFree, testId } = test
    firebase.database().ref('tests/' + testKey).update({
      name, description, length, imageUrl, videoUrl, isFree, testId
    })
    .then(() => {
      const testKey = test.id
      const { tests } = this.state
      const indexItemToRemove = tests.findIndex(item => testKey === item.id)
      const newArray = [
        ...tests.slice(0, indexItemToRemove),
        ...tests.slice(indexItemToRemove + 1),
        test
      ]
      this.setState({ tests: newArray })
    })
    .then(() => {
      this.props.hideModal('test')
      toastr.success('Your test saved!')
    })
  }

  renderQuestionsList () {
    const { isNewTest, questions = [] } = this.props
    return questions.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-12 col-md-8'>

            <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Name:</label>
              <div> {item.text}</div>
            </div>
            <div className='col-xs-10'>
              <label className='control-label col-xs-2'>answers:</label>
              <div> {item.answers}</div>
            </div>
            <div className='col-xs-10'>
              <label className='control-label col-xs-2'>rightAnswers:</label>
              <div> {item.rightAnswers}</div>
            </div>
            {/* { !!isNewtest && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Description:</label>
              <div> {item.description}</div>
            </div>}
            { !!isNewtest && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Length:</label>
              <div> {item.length}</div>
            </div>}
            { !!isNewtest && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>ImageUrl:</label>
              <div> {item.imageUrl}</div>
            </div>}
            { !!isNewtest && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>VideoUrl:</label>
              <div> {item.videoUrl}</div>
            </div>}
            { !!isNewtest && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>IsFree:</label>
              <div> {item.isFree}</div>
            </div>}
            { !!isNewtest && <div className='col-xs-10'>
              <label className='control-label col-xs-2'>TestId:</label>
              <div> {item.testId}</div>
            </div>} */}
          </div>
          {/* { !isNewtest && <div className='col-xs-12 col-md-4'>
            <button
              type='button'
              className='btn btn-primary lg'
              onClick={(e) => {
                this.renderTestPopup(e, item)
              }}
              >Edit test
            </button>
            <QuestionPopupComponent
              isNewTest={false}
              saveTest={this.editTest}

              />
          </div> } */}
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

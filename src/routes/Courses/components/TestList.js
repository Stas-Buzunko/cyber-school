import React, { Component } from 'react'
import QuestionsList from './QuestionsList'
import firebase from 'firebase'
import toastr from 'toastr'

class TestList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      test: '',
      tests: [],
      testsIds: [],
      questions: [],
      name: '',
      testsLoaded: false,
      isTestEdit: false
    }

    this.editQuestionsInTest = this.editQuestionsInTest.bind(this)
  }
  componentWillMount () {
    const { testsIds } = this.props
    this.fetchItems(testsIds)
  }

  componentWillReceiveProps (nextProps) {
    this.props.testsIds !== nextProps.testsIds && this.fetchItems(nextProps.testsIds)
  }

  fetchItems (testsIds) {
    this.setState({
      tests: [],
      testsLoaded: false
    })
    const promises = testsIds.map(id => {
      return firebase.database().ref('tests/' + id)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        const testsFromId = object
        testsFromId.id = id
        return (testsFromId)
      })
    })
    Promise.all(promises).then(result => {
      this.setState({
        tests: result,
        testsLoaded: true
      })
    })
  }

  editTest = (test) => {
    const { name, tests = [] } = this.state
    test.name = name
    const indexItemToRemove = tests.findIndex(item => test.id === item.id)
    const newArray = [
      ...tests.slice(0, indexItemToRemove),
      test,
      ...tests.slice(indexItemToRemove + 1)
    ]

    firebase.database().ref('tests/' + test.id).update({
      name
    })
    .then(() => {
      toastr.success('Your test saved!')
    })
    this.setState({
      isTestEdit: false,
      tests: newArray
    })
  }
  editTestButton = (item) => {
    const { tests = [] } = this.state
    const editTestId = item.id
    const test = tests.find(itemTest => editTestId === itemTest.id)
    this.setState({ isTestEdit: true, name: item.name, test })
  }

  editQuestionsInTest = (questions, test) => {
    const { tests = [], name } = this.state
    test.questions = questions
    const indexItemToRemove = tests.findIndex(item => test.id === item.id)
    const newArray = [
      ...tests.slice(0, indexItemToRemove),
      test,
      ...tests.slice(indexItemToRemove + 1)
    ]
    firebase.database().ref('tests/' + test.id).update({
      name, questions
    })
    .then(() => {
      toastr.success('Your test saved!')
    })
    this.setState({
      isTestEdit: false,
      tests: newArray
    })
  }

  renderTestList () {
    const { isShowEditButton } = this.props
    const { tests = [], name, isTestEdit } = this.state
    return tests.map((item, i) =>
      <li key={i}>

        {!isTestEdit && <div className='col-xs-12 col-md-12'>
          <div className='col-xs-12 col-md-4' style={{ padding: '15px' }} >
            <label>Test: {item.name}</label>
          </div>
          { !!isShowEditButton && <div className='col-xs-10 col-md-4'>
            <button
              type='button'
              className='btn btn-primary lg'
              onClick={() => { this.editTestButton(item) }}
              >Edit Test
            </button>
          </div>}
        </div> }

        {isTestEdit && <div className='col-xs-12 col-md-12'>
          <div className='form-group col-xs-10 col-md-4' style={{ padding: '15px' }}>
            <label className='control-label col-xs-4 col-md-2'>Test:</label>
            <div className='col-xs-10 col-md-4'>
              <input
                value={name}
                type='text'
                className='form-control' onChange={(e) => this.setState({ name: e.target.value })} />
            </div>
          </div>
          <div className='col-xs-10 col-md-4'>
            <button
              type='button'
              className='btn btn-primary lg'
              onClick={() => { this.editTest(item) }}
              >Save Test
            </button>
          </div>
        </div> }

        <label className='col-xs-2 col-md-6'>Questions: </label>
        <div className='col-xs-2 col-md-12'>
          <ul className='list-unstyled'>
            <QuestionsList
              test={item}
              questions={item.questions}
              isTestEdit={isTestEdit}
              editQuestionsInTest={this.editQuestionsInTest}
            />
          </ul>
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
              {this.renderTestList()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

TestList.propTypes = {
  testsIds: React.PropTypes.array,
  isShowEditButton: React.PropTypes.bool
}

export default TestList

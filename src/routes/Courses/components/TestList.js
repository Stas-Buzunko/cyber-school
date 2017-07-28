import React, { Component } from 'react'
import QuestionsList from './QuestionsList'
import firebase from 'firebase'
import toastr from 'toastr'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import DeletePopupComponent from './DeletePopupComponent'

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

  fetchItems (testsIds = []) {
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

  renderDelete (e, id) {
    e.preventDefault()
    const type = 'test'
    this.props.openModal('delete', { id , type })
  }

  deleteItem = (id, type) => {
    this.props.deleteItemId(id, type)
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
  renderTestEdit () {
    const { isShowEditButton } = this.props
    const { tests = [], name, isTestEdit, test } = this.state
    return (
    <div>
      <div className='col-xs-12 col-md-12'>
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
              onClick={() => { this.editTest(test) }}
              >Save Test
            </button>
          </div>
        </div>

        <label className='col-xs-2 col-md-6'>Questions: </label>
        <div className='col-xs-2 col-md-12'>
          <ul className='list-unstyled'>
            <QuestionsList
              test={test}
              questions={test.questions}
              isTestEdit={isTestEdit}
              editQuestionsInTest={this.editQuestionsInTest}
            />
          </ul>
        </div>
    </div>
    )
  }
  renderTestList () {
    const { isShowEditButton } = this.props
    const { tests = [], isTestEdit } = this.state
    return tests.map((item, i) =>
      <li key={i}>
       <div className='col-xs-12 col-md-12'>
          <div style={{ padding: '15px' }} >
            <label>Test: {item.name}</label>
          </div>
         {!!isShowEditButton && <div className='col-xs-10 col-md-4'>
           <button
             type='button'
             className='btn btn-primary lg'
             onClick={() => { this.editTestButton(item) }}
             >Edit Test
           </button>
           <button
             type='button'
             className='btn btn-primary lg'
             onClick={(e) => { this.renderDelete(e, item.id) }}
             >Delete Test
           </button>
         </div>}
        </div>
        <label className='col-xs-2 col-md-12'>Questions: </label>
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
        <DeletePopupComponent
          deleteItem={this.deleteItem}
        />
      </li>
    )
  }
  render () {
  const { isTestEdit } = this.state
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              {!isTestEdit && this.renderTestList()}
              {isTestEdit && this.renderTestEdit()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

TestList.propTypes = {
  openModal: React.PropTypes.func,
  testsIds: React.PropTypes.array,
  isShowEditButton: React.PropTypes.bool,
  deleteItemId: React.PropTypes.func
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}

export default connect(
  null,
  mapDispatchToProps
)(TestList)

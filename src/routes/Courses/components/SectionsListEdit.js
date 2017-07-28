import React, { Component } from 'react'
import LessonsList from './LessonsList'
import TestList from './TestList'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import toastr from 'toastr'
import firebase from 'firebase'
import NewTest from './NewTest'

class SectionsListEdit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      isEditSection: false,
      editSectionName: '',
      sections: [],
      error: '',
      isAddNewSectionOpen: false,
      isShowEditButton: false,
      isAddNewTest: false,
      isNewTest: false,
      testsIds: [],
      lessonsIds: []
    }
    this.saveLesson = this.saveLesson.bind(this)
    this.deleteItemId = this.deleteItemId.bind(this)
    this.saveTest = this.saveTest.bind(this)
    this.renderEditSection = this.renderEditSection.bind(this)
  }

  saveSection = (section) => {
    const { name, lessonsIds, testsIds } = this.state
    section.name = name
    section.lessonsIds = lessonsIds
    section.testsIds = testsIds
    const { sections = [] } = this.props
    const indexItemToRemove = sections.findIndex(item => section.sectionNumber === item.sectionNumber)
    const newArray = [
      ...sections.slice(0, indexItemToRemove),
      section,
      ...sections.slice(indexItemToRemove + 1)
    ]
    this.props.saveSections(newArray)
    this.setState({
      isEditSection: false,
      isShowEditButton: false
    })
  }

  editSectionButton = (item) => {
    const { sections = [] } = this.props
    const editSectionNumber = item.sectionNumber
    const section = sections.find(itemSection => editSectionNumber === itemSection.sectionNumber)
    this.setState({
      isEditSection: true,
      isShowEditButton: true,
      section,
      name: section.name,
      lessonsIds: section.lessonsIds,
      testsIds: section.testsIds
    })
  }

  renderSectionsList () {
    const { sections = [], isNewSection } = this.props
    const { isShowEditButton } = this.state
    return sections.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12'>
          <div className='col-xs-12 col-md-6' style={{ padding: '15px' }} >
            <label>Section:{item.name}</label>
          </div>

          <div className='col-xs-2 col-md-12'>
            <label className='col-xs-2 col-md-2'>Lessons: </label>
            <div className='col-xs-2 col-md-4'>
              <LessonsList
                SectionsListEdit={'SectionsListEdit renderSectionsList'}
                isEditSection={false}
                isNewLesson={true}
                lessonsIds={item.lessonsIds}
                editLesson={this.editLesson}
              />
            </div>
          </div>

          <div className='col-xs-2 col-md-12'>
            <label className='col-xs-2 col-md-2'>Tests: </label>
            <div className='col-xs-2 col-md-4'>
              <TestList
                isNewTest={isNewSection}
                testsIds={item.testsIds}
                isShowEditButton={isShowEditButton}
              />
            </div>
          </div>

          <button
            type='button'
            className='btn btn-primary lg'
            onClick={() => { this.editSectionButton(item) }}
            >Edit section
          </button>
        </div>
      </li>
    )
  }

  saveLesson (lesson) {
    const lessonKey = firebase.database().ref('lessons/').push().key
    const { lessonsIds = [] } = this.state
    const newLessons = [...lessonsIds, lessonKey]
    this.setState({ lessonsIds: newLessons })
    const { name, description, length, imageUrl, videoUrl, isFree, isBonus, testId, task, id } = lesson
    const comments = []
    firebase.database().ref('lessons/' + lessonKey).update({
      name, description, length, imageUrl, videoUrl, isFree, isBonus, testId, task, id, comments
    })
    this.props.hideModal('lesson')
    toastr.success('Your lesson saved!')
  }

  saveTest = (test) => {
    const testKey = firebase.database().ref('tests/').push().key
    if (testKey) {
      const { name, questions } = test
      firebase.database().ref('tests/' + testKey).update({
        name, questions
      })
      .then(() => {
        toastr.success('Your test saved!')
        const { testsIds = [] } = this.state
        const newTests = [...testsIds, testKey]
        this.setState({ isNewTest: false, isAddNewTest: false, testsIds: newTests })
      })
    }
  }

  deleteItemId (id, type) {
    const { testsIds = [], lessonsIds = [] } = this.state
    const arrayId = type === 'lesson' ? lessonsIds : testsIds
    const indexItemToRemove = arrayId.findIndex(item => item === id)
    const newArray = [
      ...arrayId.slice(0, indexItemToRemove),
      ...arrayId.slice(indexItemToRemove + 1)
    ]
    if (type === 'lesson') {
      this.setState({ lessonsIds: newArray })
    }
    if (type === 'test') {
      this.setState({ testsIds: newArray })
    }
    this.props.hideModal('delete')
    toastr.success(`Your ${type} deleted!`)
  }

  renderButtonAddNewTest () {
    return (
      <div className='col-xs-12 col-md-12'>
        <button
          type='button'
          className='btn btn-success lg'
          onClick={() => {
            this.setState({ isAddNewTest: true, isNewTest: true })
          }}>Add New Test
        </button>
      </div>
    )
  }
  renderEditSection () {
    const { name, section, isShowEditButton, isAddNewTest, lessonsIds, testsIds } = this.state
    return (
      <div className='col-xs-12 col-md-12'>
        <div className='form-group' style={{ padding: '15px' }}>
          <label className='control-label col-xs-2'>Section:</label>
          <div className='col-xs-10 col-md-6'>
            <input
              value={name}
              type='text'
              className='form-control' onChange={(e) => this.setState({ name: e.target.value })} />
          </div>
        </div>
        <div className='col-xs-2 col-md-12'>
          <label>Lessons: </label>
          <div >
            <LessonsList
              SectionsListEdit={'SectionsListEdit renderEditSection'}
              isNewLesson={false}
              lessonsIds={lessonsIds}
              isEditSection={true}
              saveLesson={this.saveLesson}
              deleteItemId={this.deleteItemId}
            />
          </div>
        </div>
        <div className='col-xs-2 col-md-8'>
          <TestList
            isNewTest={false}
            testsIds={testsIds}
            isShowEditButton={isShowEditButton}
            deleteItemId={this.deleteItemId}
          />
        </div>
        {this.renderButtonAddNewTest()}
        {!!isAddNewTest &&
          <div>
            <NewTest
              saveTest={this.saveTest}
            />
          </div>
        }
        <div className='col-xs-2 col-md-9'>
          <button
            type='button'
            className='btn btn-success lg'
            style={{ width:'30%', margin: '15px' }}
            onClick={() => {
              this.saveSection(section)
            }}>Save section
          </button>
        </div>
      </div>
    )
  }

  render () {
    const { isEditSection } = this.state
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-10'>
            <div className='col-xs-2 col-md-12'>
              {!isEditSection && this.renderSectionsList()}
              {!!isEditSection && this.renderEditSection()}
            </div>
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

SectionsListEdit.propTypes = {
  openModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  sections: React.PropTypes.array,
  isNewSection: React.PropTypes.bool,
  saveSections: React.PropTypes.func
}

export default connect(
  null,
  mapDispatchToProps
)(SectionsListEdit)

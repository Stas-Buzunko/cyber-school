import React, { Component } from 'react'
import LessonsList from './LessonList'
import TestList from './TestList'

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
      isShowEditButton: false
    }
    this.renderEditSection = this.renderEditSection.bind(this)
  }
  saveSection = (section) => {
    const { name } = this.state
    section.name = name
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
    this.setState({ isEditSection: true, isShowEditButton: true, section, name: section.name })
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

  renderEditSection () {
    const { name, section, isShowEditButton } = this.state
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
              isNewLesson={false}
              lessonsIds={section.lessonsIds}
            />
          </div>
        </div>
        <div className='col-xs-2 col-md-8'>
          <TestList
            isNewTest={false}
            testsIds={section.testsIds}
            isShowEditButton={isShowEditButton}
          />
        </div>
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

SectionsListEdit.propTypes = {
  sections: React.PropTypes.array,
  isNewSection: React.PropTypes.bool,
  saveSections: React.PropTypes.func
}

export default SectionsListEdit

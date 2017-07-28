import React, { Component } from 'react'
import LessonsList from './LessonsList'
import TestList from './TestList'

class SectionsList extends Component {

  renderSectionsList () {
    const { sections = [], isNewSection } = this.props
    return sections.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12'>
          <div className='col-xs-12 col-md-6' style={{ padding: '15px' }} >
            <label>Section: {item.name}</label>
          </div>
        </div>
        <label className='col-xs-2 col-md-4'>Lessons: </label>

          <ul className='list-unstyled'>
            <LessonsList
              sectionsList={'SectionsList'}
              isNewLesson={isNewSection}
              lessonsIds={item.lessonsIds}
              sections={sections}
            />
          </ul>
    
        <label className='col-xs-2 col-md-4'>Tests: </label>
        <div className='col-xs-2 col-md-10'>
          <ul className='list-unstyled'>
            <TestList
              isNewTest={isNewSection}
              testsIds={item.testsIds}
              section={item}
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
          <div className='col-xs-12 col-md-10'>
            <div className='col-xs-2 col-md-12'>
              {this.renderSectionsList()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SectionsList.propTypes = {
  sections: React.PropTypes.array,
  isNewSection: React.PropTypes.bool
}

export default SectionsList

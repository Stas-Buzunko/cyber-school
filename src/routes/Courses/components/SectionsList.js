import React, { Component } from 'react'
import LessonsList from './LessonList'
import TestList from './TestList'

class SectionsList extends Component {

  renderSectionsList () {
    const { sections = [] } = this.props
    return sections.map((item, i) =>
    <li key={i}>
      <div className='col-xs-12 col-md-12'>
        <div className='col-xs-12 col-md-6' style={{ padding: '15px' }} >
          <label>Section: {item.name}</label>
        </div>
      </div>
      <label className='col-xs-2 col-md-4'>Lessons: </label>
      <div className='col-xs-2 col-md-10'>
        <ul className='list-unstyled'>
          <LessonsList
            isNewLesson={true}
            lessonsIds={item.lessonsIds}
          />
        </ul>
      </div>
      <label className='col-xs-2 col-md-4'>Tests: </label>
      <div className='col-xs-2 col-md-10'>
        <ul className='list-unstyled'>
          <TestList
            isNewTest={false}
            testsIds={item.testsIds}
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
  sections: React.PropTypes.array
}

export default SectionsList

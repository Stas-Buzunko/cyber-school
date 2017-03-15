import React, { Component } from 'react'
import { browserHistory } from 'react-router'

class CoursesList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      courses: [
        { description : 'First course about cooking rissotto',
          mainPhoto:  '1',
          duration:  '34:54',
          price: '100$',
          lessons: [{
            videoLink:  '1',
            description: '1',
            test: 'ltest_id'
          }
          ]
        },
        { description: 'Course make up like Shurigina',
          mainPhoto:  '2',
          duration:  '24:40',
          price:  '20$',
          lessons: [{
            videoLink:  '2.1',
            description: '2.1',
            test: 'ltest_id2.1'
          },
          {
            video_link:  '2.2',
            description: '2.2',
            test: 'ltest_id2.2'
          }
          ]
        }
      ]
    }
  };
  render () {
    const coursesList = this.state.courses.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12'>
          <div className='col-xs-12 col-md-8'>

            <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Description:</label>
              <div> {item.description}</div>
            </div>
            <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Main photo:</label>
              <div> {item.mainPhoto}</div>
            </div> <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Duration:</label>
              <div> {item.duration}</div>
            </div> <div className='col-xs-10'>
              <label className='control-label col-xs-2'>Price:</label>
              <div> {item.price}</div>
            </div>
          </div>
          <div className='col-xs-12 col-md-4'>
            <button
              type='button'
              className='btn btn-primary lg'
              onClick={() => {
                browserHistory.push(`/admin/courses/edit/${i}`)
              }}
              >Edit course</button>
          </div>
        </div>
      </li>
      )
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-6 col-md-12' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              {coursesList}
            </ul>
            <button
              type='button'
              className='btn btn-success lg'
              onClick={() => {
                browserHistory.push(`/admin/courses/new`)
              }}
              >New course</button>
          </div>
        </div>
      </div>
    )
  }
}
export default CoursesList
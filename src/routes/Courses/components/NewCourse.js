import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import toastr from 'toastr'
import firebase from 'firebase'

class NewCourse extends Component {
  constructor (props) {
    super(props)

    this.state = {
      description: '',
      mainPhoto:  '',
      duration:  '',
      price:  '',
      discipline: '',
      lessons: [
        {
          id: '',
          videoLink: '',
          descriptionLesson: '',
          test: ''
        }
      ],
      error: ''
    }
  }
  saveCourse () {
    const { description, mainPhoto, duration, price, discipline, videoLink, descriptionLesson, test } = this.state
    this.setState({ error: '' })
    firebase.database().ref('courses/').push({
      description, mainPhoto, duration, price, discipline, videoLink, descriptionLesson, test })
      .then(() => {
        toastr.success('Your course saved!')
        browserHistory.push(`/admin/courses`)
      })
  }
  render () {
    const lessonList = this.state.lessons.map((item, i) =>

      <li key={i}>
        <div className='col-xs-12 col-md-12'>
          <label className='control-label col-xs-2 col-md-4'>Lesson: {i + 1} </label>

          <div className='col-xs-12 col-md-10'>
            <div className='form-group'>
              <label className='control-label col-xs-2'>Video link</label>
              <div className='col-xs-10 col-md-6'>
                <input
                  type='text'
                  className='form-control'
                  onChange={(e) => this.setState({ item.videoLink: e.target.value })} />
              </div>
            </div>

            <div className='form-group'>
              <label className='control-label col-xs-2'>Description</label>
              <div className='col-xs-10 col-md-6'>
                <input type='text'
                  className='form-control'
                  onChange={(e) => this.setState({ descriptionLesson: e.target.value })} />
              </div>
            </div>

            <div className='form-group'>
              <label className='control-label col-xs-2'>Test</label>
              <div className='col-xs-10 col-md-6'>
                <input type='text' className='form-control' onChange={(e) => this.setState({ test: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
      </li>
  )

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-10'>

            <form className='form-horizontal'>
              <div className='form-group'>
                <label htmlFor='inputDescription' className='control-label col-xs-2'>Description</label>
                <div className='col-xs-10 col-md-6'>
                  <input type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ description: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>MainPhoto</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ mainPhoto: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Duration</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ duration: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Price</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ price: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Discipline</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ discipline: e.target.value })} />
                </div>
              </div>
              <label className='control-label col-xs-2 col-md-4'>Lessons: </label>
              <div className='col-xs-2 col-md-10'>
                <ul className='list-unstyled'>
                  {lessonList}
                </ul>
                <div className='control-label col-xs-2 col-md-4'>
                  <button
                    type='button'

                    className='btn btn-success lg'
                    onClick={() => {
                      this.setState({
                        lessons: [
                          ...this.state.lessons,
                          this.state.lessons.length + 1
                        ]
                      })
                    }}
                >Add Lesson
              </button>
                </div>
              </div>
            </form>
            <div className='col-xs-12 col-md-10'>
              <button
                type='button'
                style={{ width:'50%', margin: '15px' }}
                className='btn btn-success lg'
                onClick={() => { this.saveCourse()
                }}
              >Save course
            </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default NewCourse

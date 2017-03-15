import React, { Component } from 'react'
import { browserHistory } from 'react-router'

class EditCourse extends Component {
  constructor (props) {
    super(props)

    this.state = {
      description: 'Video course about joga positions',
      mainPhoto:  '123321',
      duration:  '57:53',
      price:  '100$',

      videoLink:  'wwww.joga.com',
      description2: 'joga',
      test: 'ltest_id'

    }
  }

  render () {
    const { description, mainPhoto, duration, price, videoLink, description2, test } = this.state
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-10'>

            <form className='form-horizontal'>
              <div className='form-group'>
                <label htmlFor='inputDescription' className='control-label col-xs-2'>Description</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    value={description}
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ description: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Main photo</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    value={mainPhoto}
                    type='text'
                    className='form-control' onChange={(e) => this.setState({ mainPhoto: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Duration</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    value={duration}
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ duration: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Price</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    value={price}
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ price: e.target.value })} />
                </div>
              </div>

              <div className='col-xs-12 col-md-12'>
                <label className='control-label col-xs-2 col-md-4'>Lesson: 1 </label>

                <div className='col-xs-12 col-md-10'>
                  <div className='form-group'>
                    <label className='control-label col-xs-2'>Video link</label>
                    <div className='col-xs-10 col-md-6'>
                      <input
                        value={videoLink}
                        type='text'
                        className='form-control'
                        onChange={(e) => this.setState({ videoLink: e.target.value })} />
                    </div>
                  </div>

                  <div className='form-group'>
                    <label className='control-label col-xs-2'>Description</label>
                    <div className='col-xs-10 col-md-6'>
                      <input
                        value={description2}
                        type='text'
                        className='form-control'
                        onChange={(e) => this.setState({ descriptionLesson: e.target.value })} />
                    </div>
                  </div>

                  <div className='form-group'>
                    <label className='control-label col-xs-2'>Test</label>
                    <div className='col-xs-10 col-md-6'>
                      <input
                        value={test}
                        type='text'
                        className='form-control'
                        onChange={(e) => this.setState({ test: e.target.value })} />
                    </div>
                  </div>
                </div>
              </div>

            </form>

            <button
              type='button'
              className='btn btn-success lg'
              style={{ width:'50%', margin: '15px' }}
              onClick={() => {
                browserHistory.push(`/admin/courses`)
              }}
              >Save course
            </button>
          </div>
        </div>
      </div>
    )
  }

}
export default EditCourse

import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import firebase from 'firebase'
import toastr from 'toastr'
import './MainView.scss'

class Course extends Component {
  constructor (props) {
    super(props)
    this.state = {
      siteInfoLoaded: false,
      duration:''
    }
  }

  componentWillMount () {
    this.fetchSiteInfo()
  }

  fetchSiteInfo () {
    this.setState({
      infoLoaded: false
    })
    firebase.database().ref('siteInfo/' + 'russian')
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const { duration } = object
        this.setState({ duration, siteInfoLoaded: true })
      } else {
        this.setState({ siteInfoLoaded: true })
      }
    }
  )
  }

  editSiteInfo () {
    const { duration } = this.state

    firebase.database().ref('siteInfo/' + 'russian')
    .update({ duration })
      .then(() => {
        toastr.success('Your siteInfo saved!')
        browserHistory.push(`/admin/siteInfo`)
      })
  }

  renderCoursesList () {
    const { duration } = this.state
    return (
      <div className='container'>
        <div className='row'>
          <form className='form-horizontal'>

            <div className='form-group'>
              <label className='control-label'>duration</label>
              <input
                value={duration}
                type='text'
                className='form-control' onChange={(e) => this.setState({ duration: e.target.value })} />
            </div>
          </form>

          <div className='col-xs-12 col-md-12'>
            <button
              type='button'
              className='btn btn-success lg'
              style={{ width:'100%', margin: '15px' }}
              onClick={() => this.editSiteInfo()}
              >Save changes
            </button>
          </div>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              {this.renderCoursesList()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Course

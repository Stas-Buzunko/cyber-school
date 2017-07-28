import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import firebase from 'firebase'
import toastr from 'toastr'
import './MainView.scss'

class Faculties extends Component {
  constructor (props) {
    super(props)
    this.state = {
      siteInfoLoaded: false,
      about:'',
      becomeACoach:'',
      faq:'',
      support:'',
      terms:'',
      coaches:''
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
        const { about,
                becomeACoach,
                faq,
                support,
                terms,
                coaches } = object
        this.setState({
          about,
          becomeACoach,
          faq,
          support,
          terms,
          coaches,
          siteInfoLoaded: true })
      } else {
        this.setState({ siteInfoLoaded: true })
      }
    }
  )
  }

  editSiteInfo () {
    const { about,
      becomeACoach,
      faq,
      support,
      terms,
      coaches } = this.state

    firebase.database().ref('siteInfo/' + 'russian')
    .update({
      about,
      becomeACoach,
      faq,
      support,
      terms,
      coaches })
      .then(() => {
        toastr.success('Your siteInfo saved!')
        browserHistory.push(`/admin/siteInfo`)
      })
  }

  renderCoursesList () {
    const { about,
      becomeACoach,
      faq,
      support,
      terms,
      coaches } = this.state
    return (
      <div className='container'>
        <div className='row'>
          <form className='form-horizontal'>

            <div className='form-group'>
              <label className='control-label'>about</label>
              <input
                value={about}
                type='text'
                className='form-control' onChange={(e) => this.setState({ about: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>becomeACoach</label>
              <input
                value={becomeACoach}
                type='text'
                className='form-control' onChange={(e) => this.setState({ becomeACoach: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>faq</label>
              <input
                value={faq}
                type='text'
                className='form-control' onChange={(e) => this.setState({ faq: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>support</label>
              <input
                value={support}
                type='text'
                className='form-control' onChange={(e) => this.setState({ support: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>terms</label>
              <input
                value={terms}
                type='text'
                className='form-control' onChange={(e) => this.setState({ terms: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>coaches</label>
              <input
                value={coaches}
                type='text'
                className='form-control' onChange={(e) => this.setState({ coaches: e.target.value })} />
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

export default Faculties

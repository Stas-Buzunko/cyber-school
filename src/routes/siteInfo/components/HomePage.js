import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import firebase from 'firebase'
import toastr from 'toastr'
import './MainView.scss'

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      siteInfoLoaded: false,
      quaterText1: '',
      quaterText2: '',
      quaterText3: '',
      quaterText4: '',
      linkVideoToParents: '',
      buttonText: ''
    }
  }

  componentWillMount () {
    this.fetchSiteInfo()
  }

  fetchSiteInfo () {
    this.setState({
      info: [],
      infoLoaded: false
    })
    firebase.database().ref('siteInfo/' + 'russian')
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const { quaterText1, quaterText2, quaterText3, quaterText4, linkVideoToParents, buttonText } = object
        this.setState({ quaterText1,
          quaterText2,
          quaterText3,
          quaterText4,
          linkVideoToParents,
          buttonText,
          siteInfoLoaded: true })
      } else {
        this.setState({ siteInfoLoaded: true })
      }
    }
  )
  }

  editSiteInfo () {
    const { quaterText1, quaterText2, quaterText3, quaterText4, linkVideoToParents, buttonText } = this.state
    console.log(quaterText1, quaterText2, quaterText3, quaterText4, linkVideoToParents, buttonText)
    const dateEdited = Date.now()
    firebase.database().ref('siteInfo/'+ 'russian')
    .update({
      quaterText1, quaterText2, quaterText3, quaterText4, linkVideoToParents, buttonText, dateEdited })
      .then(() => {
        toastr.success('Your siteInfo saved!')
        browserHistory.push(`/admin/siteInfo`)
      })
  }

  renderCoursesList () {
    const { quaterText1, quaterText2, quaterText3, quaterText4, linkVideoToParents, buttonText } = this.state
    return (
      <div className='container'>
        <div className='row'>
          <form className='form-horizontal'>

            <div className='form-group'>
              <label className='control-label'>quaterText1</label>
              <input
                value={quaterText1}
                type='text'
                className='form-control' onChange={(e) => this.setState({ quaterText1: e.target.value })} />
            </div>

              <div className='form-group'>
                <label className='control-label'>quaterText2</label>
                <input
                  value={quaterText2}
                  type='text'
                  className='form-control' onChange={(e) => this.setState({ quaterText2: e.target.value })} />
              </div>

            <div className='form-group'>
              <label className='control-label'>quaterText3</label>
              <input
                value={quaterText3}
                type='text'
                className='form-control' onChange={(e) => this.setState({ quaterText3: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>quaterText4</label>
              <input
                value={quaterText4}
                type='text'
                className='form-control' onChange={(e) => this.setState({ quaterText4: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'> Video link to parents</label>
                <input
                  value={linkVideoToParents}
                  type='text'
                  className='form-control' onChange={(e) => this.setState({ linkVideoToParents: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>Button text</label>
                <input
                  value={buttonText}
                  type='text'
                  className='form-control' onChange={(e) => this.setState({ buttonText: e.target.value })} />
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

export default HomePage

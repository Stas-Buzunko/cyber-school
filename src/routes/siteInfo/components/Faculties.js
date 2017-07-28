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
      DotaButton: '',
      LoLButton: '',
      CSGOButton: '',
      DotaDescription: '',
      LoLDescription: '',
      CSGODescription: '',
      DotaImg: '',
      LoLImg: '',
      CSGOImg: ''
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
        const { DotaButton,
                LoLButton,
                CSGOButton,
                DotaDescription,
                LoLDescription,
                CSGODescription,
                DotaImg,
                LoLImg,
                CSGOImg } = object
        this.setState({
          DotaButton,
          LoLButton,
          CSGOButton,
          DotaDescription,
          LoLDescription,
          CSGODescription,
          DotaImg,
          LoLImg,
          CSGOImg,
          siteInfoLoaded: true })
      } else {
        this.setState({ siteInfoLoaded: true })
      }
    }
  )
  }

  editSiteInfo () {
    const { DotaButton,
            LoLButton,
            CSGOButton,
            DotaDescription,
            LoLDescription,
            CSGODescription,
            DotaImg,
            LoLImg,
            CSGOImg } = this.state

    firebase.database().ref('siteInfo/' + 'russian')
    .update({
      DotaButton,
      LoLButton,
      CSGOButton,
      DotaDescription,
      LoLDescription,
      CSGODescription,
      DotaImg,
      LoLImg,
      CSGOImg })
      .then(() => {
        toastr.success('Your siteInfo saved!')
        browserHistory.push(`/admin/siteInfo`)
      })
  }

  renderCoursesList () {
    const { DotaButton,
            LoLButton,
            CSGOButton,
            DotaDescription,
            LoLDescription,
            CSGODescription,
            DotaImg,
            LoLImg,
            CSGOImg } = this.state
    return (
      <div className='container'>
        <div className='row'>
          <form className='form-horizontal'>

            <div className='form-group'>
              <label className='control-label'>DotaButton</label>
              <input
                value={DotaButton}
                type='text'
                className='form-control' onChange={(e) => this.setState({ DotaButton: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>LoLButton</label>
              <input
                value={LoLButton}
                type='text'
                className='form-control' onChange={(e) => this.setState({ LoLButton: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>CSGOButton</label>
              <input
                value={CSGOButton}
                type='text'
                className='form-control' onChange={(e) => this.setState({ CSGOButton: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>DotaDescription</label>
              <input
                value={DotaDescription}
                type='text'
                className='form-control' onChange={(e) => this.setState({ DotaDescription: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'> LoLDescription</label>
              <input
                value={LoLDescription}
                type='text'
                className='form-control' onChange={(e) => this.setState({ LoLDescription: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>CSGODescription</label>
              <input
                value={CSGODescription}
                type='text'
                className='form-control' onChange={(e) => this.setState({ CSGODescription: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>DotaImg(link)</label>
              <input
                value={DotaImg}
                type='text'
                className='form-control' onChange={(e) => this.setState({ DotaImg: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'> LoLImg(link)</label>
              <input
                value={LoLImg}
                type='text'
                className='form-control' onChange={(e) => this.setState({ LoLImg: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>CSGOImg(link)</label>
              <input
                value={CSGOImg}
                type='text'
                className='form-control' onChange={(e) => this.setState({ CSGOImg: e.target.value })} />
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

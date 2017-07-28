import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import firebase from 'firebase'
import toastr from 'toastr'
import './MainView.scss'

class Faculty extends Component {
  constructor (props) {
    super(props)
    this.state = {
      siteInfoLoaded: false,
      hiWord:'',
      startButton:'',
      logoBannerDota:'',
      logoBannerCSGO:'',
      logoBannerLoL:'',
      reviews:'',
      duration:'',
      reviewsImg:''
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
        const { hiWord,
          startButton,
          logoBannerDota,
          logoBannerCSGO,
          logoBannerLoL,
          reviews,
          reviewsImg,
          duration } = object
        this.setState({
          hiWord,
          startButton,
          logoBannerDota,
          logoBannerCSGO,
          logoBannerLoL,
          reviews,
          reviewsImg,
          duration,
          siteInfoLoaded: true })
      } else {
        this.setState({ siteInfoLoaded: true })
      }
    }
    )
  }

  editSiteInfo () {
    const { hiWord,
      startButton,
      logoBannerDota,
      logoBannerCSGO,
      logoBannerLoL,
      reviews,
      duration,
      reviewsImg } = this.state

    firebase.database().ref('siteInfo/' + 'russian')
      .update({
        hiWord,
        startButton,
        logoBannerDota,
        logoBannerCSGO,
        logoBannerLoL,
        reviews,
        duration,
        reviewsImg })
        .then(() => {
          toastr.success('Your siteInfo saved!')
          browserHistory.push(`/admin/siteInfo`)
        })
  }

  renderCoursesList () {
    const { hiWord,
      startButton,
      logoBannerDota,
      logoBannerCSGO,
      logoBannerLoL,
      reviews,
      duration,
      reviewsImg } = this.state
    return (
      <div className='container'>
        <div className='row'>
          <form className='form-horizontal'>

            <div className='form-group'>
              <label className='control-label'>hiWord</label>
              <input
                  value={hiWord}
                  type='text'
                  className='form-control' onChange={(e) => this.setState({ hiWord: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>startButton</label>
              <input
                value={startButton}
                type='text'
                className='form-control' onChange={(e) => this.setState({ startButton: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>logoBannerDota(link)</label>
              <input
                value={logoBannerDota}
                type='text'
                className='form-control' onChange={(e) => this.setState({ logoBannerDota: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>logoBannerCSGO(link)</label>
              <input
                value={logoBannerCSGO}
                type='text'
                className='form-control' onChange={(e) => this.setState({ logoBannerCSGO: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'> logoBannerLoL(link)</label>
              <input
                value={logoBannerLoL}
                type='text'
                className='form-control' onChange={(e) => this.setState({ logoBannerLoL: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>reviews</label>
              <input
                value={reviews}
                type='text'
                className='form-control' onChange={(e) => this.setState({ reviews: e.target.value })} />
            </div>

            <div className='form-group'>
              <label className='control-label'>reviewsImg(link)</label>
              <input
                value={reviewsImg}
                type='text'
                className='form-control' onChange={(e) => this.setState({ reviewsImg: e.target.value })} />
            </div>

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

export default Faculty

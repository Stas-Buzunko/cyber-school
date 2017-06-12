import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import toastr from 'toastr'
import firebase from 'firebase'
import SectionsList from './SectionsList'
import NewSection from './NewSection'

class NewCourse extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      description: '',
      mainPhoto:'',
      duration:'',
      dateUploaded:'',
      price:'',
      discipline:'',
      author:'',
      sections:[],
      error: ''
    }
    this.saveSection = this.saveSection.bind(this)
    this.saveCourse = this.saveCourse.bind(this)
  }

  saveCourse () {
    const { name, description, mainPhoto, duration, price, vipPrice, discipline, author, sections } = this.state
    const dateUploaded = Date.now()
    if (!name || !description || !mainPhoto || !duration || !dateUploaded || !price || !vipPrice ||
       !discipline || !author) {
      if (!name) {
        toastr.error('Please, fill name')
      };
      if (!description) {
        toastr.error('Please, fill description')
      };
      if (!mainPhoto) {
        toastr.error('Please, fill main photo')
      };
      if (!duration) {
        toastr.error('Please, fill duration')
      };
      if (!dateUploaded) {
        toastr.error('Please, fill date uploaded')
      };
      if (!price) {
        toastr.error('Please, fill price')
      };
      if (!vipPrice) {
        toastr.error('Please, fill vipPrice')
      };
      if (!discipline) {
        toastr.error('Please, fill discipline')
      };
      if (!author) {
        toastr.error('Please, fill author')
      };
      return false
    }
    this.setState({ error: '' })
    const courseId = firebase.database().ref('courses/').push().key
    firebase.database().ref('forumSections/' + courseId).update({ courseId })
    firebase.database().ref('courses/' + courseId).update({
      name,
      description,
      mainPhoto,
      duration,
      dateUploaded,
      price,
      vipPrice,
      discipline,
      author,
      sections
    })
    .then(() => {
      toastr.success('Your course saved!')
      browserHistory.push(`/admin/courses`)
    })
  }

  saveSection = (section) => {
    const { sections = [] } = this.state
    const newSections = [...sections, section]
    this.setState({ sections: newSections })
  }

  render () {
    const { sections } = this.state
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-10'>
            <form className='form-horizontal'>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Name</label>
                <div className='col-xs-10 col-md-6'>
                  <input type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ name: e.target.value })} />
                </div>
              </div>
              <div className='form-group'>
                <label className='control-label col-xs-2'>Description</label>
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
                <label className='control-label col-xs-2'>VipPrice</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ vipPrice: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Discipline</label>
                <div className='col-xs-10 col-md-6'>
                <select className='form-control'
                  onChange={(e) => this.setState({ discipline: e.target.value })}>
                  <option>Dota2</option>
                  <option>CS:GO</option>
                  <option>LoL</option>
                </select>
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Author</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ author: e.target.value })} />
                </div>
              </div>

              <label className='control-label col-xs-2 col-md-2' style={{ padding: '15px' }}>Sections: </label>
              <div className='col-xs-2 col-md-12'>
                <ul className='list-unstyled'>
                  <SectionsList
                    sections={sections}
                    isNewSection={true}
                  />
                  <NewSection
                    saveSection={this.saveSection}
                    sectionNumber={sections.length}
                  />
                </ul>
              </div>
            </form>

            <div className='col-xs-12 col-md-10'>
              <button
                type='button'
                style={{ width:'50%', margin: '15px' }}
                className='btn btn-success lg'
                onClick={() => { this.saveCourse() }}
              >Save course
            </button>
            </div>
            <p />
          </div>
        </div>
      </div>
    )
  }
}

export default NewCourse

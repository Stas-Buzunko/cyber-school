import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import firebase from 'firebase'
import toastr from 'toastr'
import SectionsListEdit from './SectionsListEdit'
import NewSection from './NewSection'

class EditCourse extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      discipline: '',
      author:'',
      description: '',
      mainPhoto:'',
      duration:'',
      price:'',
      vipPrice: '',
      sections: [],
      id: this.props.params.id,
      error: '',
      isAddNewSectionOpen: false
    }
    this.editCourse = this.editCourse.bind(this)
    this.addNewSection = this.addNewSection.bind(this)
    this.saveSections = this.saveSections.bind(this)
    this.addSectionButton = this.addSectionButton.bind(this)
  }
  componentWillMount () {
    this.fetchCourse(this.state.id)
  }

  fetchCourse (id) {
    firebase.database().ref('courses/' + id)
      .on('value', snapshot => {
        const object = snapshot.val()
        if (object !== null) {
          const { name, description, mainPhoto, duration, price, vipPrice, discipline, author, sections, id } = object
          this.setState({ name, description, mainPhoto, duration, price, vipPrice, discipline, author, sections, id })
        } else {
          this.setState({ error: true })
        }
      })
  }
  editCourse () {
    const { id } = this.props.params
    const { name, discipline, author, description, mainPhoto, duration, price, vipPrice, sections } = this.state
    const dateUploaded = Date.now()
    this.setState({ error: '' })
    firebase.database().ref('courses/' + id)
    .update({
      name, discipline, author, description, mainPhoto, duration, price, vipPrice, dateUploaded, id, sections })
      .then(() => {
        toastr.success('Your course saved!')
        browserHistory.push(`/admin/courses`)
      })
  }

  addSectionButton = () => {
    this.setState({ isAddNewSectionOpen: true })
  }

  addNewSection = (section) => {
    const { sections = [] } = this.state
    const newSections = [...sections, section]
    this.setState({ sections: newSections, isAddNewSectionOpen: false })
  }

  saveSections = (sections) => {
    this.setState({ sections })
  }

  render () {
    const { name, discipline, author, description, mainPhoto, duration, vipPrice,
    price, sections = [], isAddNewSectionOpen } = this.state
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-10'>
            <form className='form-horizontal'>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Name</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    value={name}
                    type='text'
                    className='form-control' onChange={(e) => this.setState({ name: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Discipline</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    value={discipline}
                    type='text'
                    className='form-control' onChange={(e) => this.setState({ discipline: e.target.value })} />
                </div>
              </div>

              <div className='form-group'>
                <label className='control-label col-xs-2'>Author</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    value={author}
                    type='text'
                    className='form-control' onChange={(e) => this.setState({ author: e.target.value })} />
                </div>
              </div>

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
                    className='form-control'
                    onChange={(e) => this.setState({ mainPhoto: e.target.value })} />
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

              <div className='form-group'>
                <label className='control-label col-xs-2'>vipPrice</label>
                <div className='col-xs-10 col-md-6'>
                  <input
                    value={vipPrice}
                    type='text'
                    className='form-control'
                    onChange={(e) => this.setState({ vipPrice: e.target.value })} />
                </div>
              </div>
              <div className='col-xs-12 col-md-12'>
                <label className='control-label col-xs-2 col-md-4'>Sections: </label>
                <ul className='list-unstyled'>
                  <SectionsListEdit
                    isNewSection={false}
                    sections={sections}
                    saveSections={this.saveSections}
                  />
                  <div className='col-xs-12 col-md-10'>
                    <button
                      type='button'
                      className='btn btn-success lg'
                      style={{ width:'30%', margin: '15px' }}
                      onClick={this.addSectionButton}
                    >Add new section
                  </button>
                  </div>
                  {!!isAddNewSectionOpen &&
                    <NewSection
                      sectionNumber={sections.length}
                      saveSection={this.addNewSection}
                  />
                  }
                </ul>
              </div>
            </form>

            <div className='col-xs-12 col-md-10'>
              <button
                type='button'
                className='btn btn-success lg'
                style={{ width:'50%', margin: '15px' }}
                onClick={this.editCourse}
              >Save changes
            </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
EditCourse.propTypes = {
  id: React.PropTypes.string,
  params: React.PropTypes.object
}
export default EditCourse

import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import firebase from 'firebase'
import toastr from 'toastr'
import LessonsList from './LessonList'

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
      lessonsIds: [],
      id: this.props.params.id,
      error: ''
    }
    this.editCourse = this.editCourse.bind(this)
  }
  componentWillMount () {
    this.fetchCourse(this.state.id)
  }

  fetchCourse (id) {
    firebase.database().ref('courses/' + id)
      .on('value', snapshot => {
        const object = snapshot.val()
        if (object !== null) {
          this.setState({
            name: object.name,
            description: object.description,
            mainPhoto: object.mainPhoto,
            duration: object.duration,
            price: object.price,
            discipline: object.discipline,
            author: object.author,
            lessonsIds: object.lessonsIds
          })
        } else {
          this.setState({ error: true })
        }
      })
  }
  editCourse () {
    const { name, discipline, author, description, mainPhoto, duration, price, id } = this.state
    const dateUploaded = Date.now()
    this.setState({ error: '' })
    firebase.database().ref('courses/' + id)
    .update({
      name, discipline, author, description, mainPhoto, duration, price, dateUploaded })
      .then(() => {
        toastr.success('Your course saved!')
        browserHistory.push(`/admin/courses`)
      })
  }
  render () {
    const { name, discipline, author, description, mainPhoto, duration, price, lessonsIds } = this.state
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
              <div className='col-xs-12 col-md-12'>
                <label className='control-label col-xs-2 col-md-4'>Lesson List </label>

                <LessonsList
                  isNewLesson={false}
                  lessonsIds={lessonsIds}
                />
              </div>
            </form>

            <div className='col-xs-12 col-md-10'>
              <button
                type='button'
                className='btn btn-success lg'
                style={{ width:'50%', margin: '15px' }}
                onClick={() => this.editCourse()}
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

import React, { Component, PropTypes } from 'react'
import firebase from 'firebase'
import CommentList from './CommentList'
import { Link } from 'react-router'
import { connect } from 'react-redux'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      course: {},
      courseLoaded: false,
      lessons: [],
      lessonsLoaded: false

    }
  }

  componentWillMount () {
    const { params } = this.props
    this.fetchItem(params.id)
  }

  fetchItem (id) {
    this.setState({
      course: {},
      courseLoaded: false,
      lessons: [],
      lessonsLoaded: false
    })

    firebase.database().ref('courses/' + id)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const course = { ...snapshot.val(), id }
        const promises = course.lessonsIds.map(id =>
          firebase.database().ref('lessons/' + id)
          .once('value')
          .then(snapshot2 => ({ ...snapshot2.val(), id }))
        )
        Promise.all(promises).then(lessons => {
          this.setState({
            lessons,
            course,
            comments: course.comments,
            courseLoaded: true,
            lessonsLoaded: true
          })
        })
      } else {
        this.setState({ courseLoaded: true })
      }
    })
  }

  renderLessonsList () {
    const { lessons } = this.state
    return (
      <div className='col-xs-12 col-md-12'>
        <div className='col-xs-12 col-md-8'>
          <table className='table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Length</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((item, i) =>
                <tr key={i}>
                  <td>
                    {item.isFree &&
                      <Link to={{ pathname: `/lesson/${item.id}` }}>{item.name}</Link> }
                    {!item.isFree &&
                      <div>{item.name}</div> }
                  </td>
                  <td> {item.length} </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  render () {
    const { course, comments } = this.state
    const { params } = this.props
    return (
      <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
        <div className='col-xs-12 col-md-12'>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Name:</label>
            <div> {course.name}</div>
          </div>
          <div className='col-xs-10' style={{ padding: '15px' }}>
            <label className='control-label col-xs-2'>Main photo:</label>
            <img src={course.mainPhoto} className='img-thumbnail' width='400px' height='250px' />
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Description:</label>
            <div> {course.description}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Duration:</label>
            <div> {course.duration}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Price:</label>
            <div> {course.price}</div>
          </div>
          <div className='col-xs-10'>
            <label className='control-label col-xs-2'>Discipline:</label>
            <div> {course.discipline}</div>
          </div>
        </div>
        <div className='col-xs-12 col-md-10'>
          <ul className='list-unstyled'>
            <CommentList
              comments={comments}
              courseId={params.id}
            />
          </ul>
        </div>
        <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
          <label className='control-label col-xs-8' style={{ padding: '15px' }}>Lessons: </label>
          <ul className='list-unstyled'>
            {this.renderLessonsList()}
          </ul>
        </div>
      </div>
    )
  }
}

MainView.propTypes = {
  params: PropTypes.object,
  user: PropTypes.object
}

const mapStateToProps = state => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(MainView)

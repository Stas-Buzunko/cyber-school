import React, { Component, PropTypes } from 'react'
import firebase from 'firebase'
import CommentList from '../containers/CommentListContainer'
import { Link } from 'react-router'
import { connect } from 'react-redux'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      course: {},
      courseLoaded: false,
      lessons: [],
      lessonsLoaded: false,
      showComments: false,
      buttonName: 'Show Comments'

    }
  }

  componentWillMount () {
    const { params } = this.props
    this.fetchItem(params.courseId)
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
        const { sections } = course
        const newSectionsLessons = sections.map(section => {
          const promisesLessons = section.lessonsIds.map(id =>
            firebase.database().ref('lessons/' + id)
            .once('value')
            .then(snapshot2 => ({ ...snapshot2.val(), id }))
          )
          return Promise.all(promisesLessons).then(lessons => {
            section = { ...section, lessons }
            return (section)
          })
        })
        Promise.all(newSectionsLessons).then(result => {
          this.setState({
            sections: result,
            course,
            courseLoaded: true,
            lessonsLoaded: true
          })
          const { sections } = this.state
          const newSectionsTests = sections.map(section => {
            const promisesTests = section.testsIds.map(id =>
              firebase.database().ref('tests/' + id)
              .once('value')
              .then(snapshot3 => ({ ...snapshot3.val(), id }))
            )
            return Promise.all(promisesTests).then(tests => {
              section = { ...section, tests }
              return (section)
            })
          })
          Promise.all(newSectionsTests).then(result => {
            this.setState({
              sections: result,
              testsLoaded: true
            })
          })
        })
      } else {
        this.setState({ courseLoaded: true })
      }
    })
  }

  renderLessonsList (lessons = []) {
    const { location } = this.props

    return lessons.map((item, i) =>
      <tr key={i}>
        <td>
          <Link to={{ pathname: `${location.pathname}/lesson/${item.id}` }}>{item.name}</Link>
        </td>
        <td> {item.length} </td>
      </tr>
    )
  }
  renderTestsList (tests = []) {
    const { location } = this.props

    return tests.map((item, i) =>
      <tr key={i}>
        <td>
          <Link to={{ pathname: `${location.pathname}/test/${item.id}` }}>{item.name}</Link>
        </td>
        <td> </td>
      </tr>
    )
  }

  renderSectionsList () {
    const { sections = [] } = this.state
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
            {sections.map((item, i) =>
              <tbody key={i}>
                <tr>
                  <td>
                    <div className='col-xs-12 col-md-4'>{item.name}</div>
                  </td>
                  <td />
                </tr>
                {this.renderLessonsList(item.lessons)}
                {this.renderTestsList(item.tests)}
              </tbody>
            )}
          </table>
        </div>
      </div>
    )
  }

  buttonClick () {
    const { showComments, buttonName } = this.state
    const newButtonName = (buttonName === 'Show Comments') ? 'Hide Comments' : 'Show Comments'
    this.setState({ showComments: !showComments, buttonName: newButtonName })
  }

  renderShowCommentsButton () {
    const { buttonName } = this.state
    return (
      <div className='col-xs-12 col-md-10'>
        <button
          type='button'
          className='btn btn-success lg'
          style={{ width:'30%', margin: '15px' }}
          onClick={() => this.buttonClick()}
          >{buttonName}
        </button>
      </div>
    )
  }

  render () {
    const { course, showComments } = this.state
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
        {this.renderShowCommentsButton()}
        {showComments && <div className='col-xs-12 col-md-10'>
          <ul className='list-unstyled'>
            <CommentList
              courseId={params.courseId}
            />
          </ul>
        </div>
      }
        <div className='col-xs-6 col-md-10' style={{ padding: '15px' }}>
          <label className='control-label col-xs-8' style={{ padding: '15px' }}>Lessons: </label>
          <ul className='list-unstyled'>
            {this.renderSectionsList()}
          </ul>
        </div>
      </div>
    )
  }
}

MainView.propTypes = {
  params: PropTypes.object,
  location: PropTypes.object
}

const mapStateToProps = state => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(MainView)

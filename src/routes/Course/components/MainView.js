import React, { Component, PropTypes } from 'react'
import firebase from 'firebase'
import CommentList from './CommentList'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import StripeComponent from '../../../components/StripeComponent'
import backend from '../../../../config/apis'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      course: {},
      courseLoaded: false,
      lessons: [],
      lessonsLoaded: false,
      sections: [],
      courseLessons: []
    }
    this.renderSectionsList = this.renderSectionsList.bind(this)
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
        const { sections } = course
        const newSections = sections.map(section => {
          const promises = section.lessonsIds.map(id =>
            firebase.database().ref('lessons/' + id)
            .once('value')
            .then(snapshot2 => ({ ...snapshot2.val(), id }))
          )
          return Promise.all(promises).then(lessons => {
            section = { ...section, lessons }
            return (section)
          })
        })
        Promise.all(newSections).then(result => {
          this.setState({
            sections: result,
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

  renderLessonsList (lessons = []) {
    return lessons.map((item, i) =>
      <tr key={i}>
        <td>
          {item.isFree &&
          <Link to={{ pathname: `/lesson/${item.id}` }}>{item.name}</Link> }
          {!item.isFree &&
          <div>{item.name}</div> }
        </td>
        <td> {item.length} </td>
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
                    <div>{item.name}</div>
                  </td>
                  <td />
                </tr>
                {this.renderLessonsList(item.lessons)}
              </tbody>
            )}
          </table>
        </div>
      </div>
    )
  }

  renderBuyButton () {
    const { course, courseLoaded } = this.state
    const { user } = this.props

    if (!Object.keys(user).length) {
      return (<a href={`${backend}/auth/steam`}>Login to Apply</a>)
    }

    if (courseLoaded && course.name) {
      return (
        <StripeComponent
          amount={course.price * 100}
          buttonText='Buy course'
          courseId={course.id}
          description={course.name}
          userId={user.uid} />
      )
    }

    return false
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
          {this.renderBuyButton()}

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
            {this.renderSectionsList()}
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

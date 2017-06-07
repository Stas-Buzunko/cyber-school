import React, { Component, PropTypes } from 'react'
import firebase from 'firebase'
import CommentList from '../containers/CommentListContainer'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import StripeComponent from '../../../components/StripeComponent'
import backend from '../../../../config/apis'
import './MainView.scss'
import VideoPlayer from './VideoPlayer'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      course: {},
      courseLoaded: false,
      lessons: [],
      lessonsLoaded: false,
      sections: [],
      courseLessons: [],
      showComments: false,
      buttonName: 'Show Comments',
      lessonDescription: ''
        }
    this.renderSectionsList = this.renderSectionsList.bind(this)
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
          console.log(result)
          this.setState({
            sections: result,
            course,
            comments: course.comments,
            lessonDescription: result[0].lessons[0].description,
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
    const { location } = this.props
    return lessons.map((item, i) =>
      <tr key={i}>
        <td>
          {/* {item.isFree &&
          <Link to={{ pathname: `${location.pathname}/lesson/${item.id}` }}>{item.name}</Link> } */}
          {/* {!item.isFree && */}
          <div
            onClick={() => { this.setState({ lessonDescription: item.description }) }}
            >{item.name}</div>
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
                {this.renderLessonsList(item.lessons)}
              </tbody>
            )}
          </table>
        </div>
      </div>
    )
  }

  renderDescripton () {
      const { lessonDescription } = this.state
      return (
        <div className='col-xs-12 col-md-12'>
          <div className='col-xs-12 col-md-8'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Description</th>
                </tr>
              </thead>
                <tbody>
                {lessonDescription}
                </tbody>

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
    const { course, showComments, sections, courseLoaded } = this.state
    const { params, user } = this.props
    const isBuyButtonShow = () => {
      if (user.userCourses) {
        const index = user.userCourses.findIndex(course => course.courseId === params.courseId)
        return (index === -1)
      }
      return false
    }
    return (
      <div className='container container-course text-center'>
        <div className='row'>
          <div className='col-xs-12 col-md-12 course-name'> {course.name}</div>
          <div className='col-xs-12 col-md-12'>
            {courseLoaded && <VideoPlayer
              url={sections[0].lessons[0].videoUrl}
            />}
          </div>
          <label className='control-label col-xs-3 col-md-3'>Duration:</label>
          <div className='col-xs-3 col-md-3'> {course.duration} hours</div>
          <label className='control-label col-xs-3 col-md-3'>Price:</label>
          <div className='col-xs-3 col-md-3'> {course.price}</div>
          <div className='col-xs-12 col-md-12'>{!!isBuyButtonShow() && this.renderBuyButton()}</div>

          <div className='col-xs-6 col-md-6' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              {this.renderSectionsList()}
            </ul>
          </div>
          <div className='col-xs-6 col-md-6' style={{ padding: '15px' }}>
            <ul className='list-unstyled'>
              {this.renderDescripton()}
            </ul>
          </div>
          <div className='col-xs-12 col-md-12'>
            {this.renderShowCommentsButton()}
            {showComments && <div className='col-xs-12 col-md-10'>
              <ul className='list-unstyled'>
                <CommentList
                  courseId={params.courseId}
                />
              </ul>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
  }

MainView.propTypes = {
  params: PropTypes.object,
  user: PropTypes.object,
  location: PropTypes.object
}

const mapStateToProps = state => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(MainView)

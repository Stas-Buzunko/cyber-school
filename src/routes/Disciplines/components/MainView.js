import React, { Component } from 'react'
import firebase from 'firebase'
import { browserHistory } from 'react-router'
import './MainView.scss'

class MainView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      courses: [],
      coursesFetched: false
    }
  }

  componentWillMount () {
    const { params } = this.props
    this.fetchCourses(params.discipline)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.params.discipline !== nextProps.params.discipline) {
      this.fetchCourses(nextProps.params.discipline)
    }
  }

  fetchCourses (discipline) {
    firebase.database().ref('courses')
    .orderByChild('discipline')
    .equalTo(discipline)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()

      if (object !== null) {
        const courses = Object.keys(object).map(id => ({ ...object[id], id }))
        this.setState({ courses, coursesFetched: true })
      } else {
        this.setState({ coursesFetched: true })
      }
    })
  }

  rederCourses () {
    const { courses } = this.state
    return courses.map((course, i) => (
      <div key={i}>
        <div className='col-sm-4 col-md-4'>
          <div className={`course${i % 3}`}>
            <div className='text-time'>
              2-3 недели
            </div>
            <div className='text-name'>
              {course.name}
            </div>
            <div className='text-course'>
              {course.description}
            </div>

          </div>
          <div
            className='btn-start'
            onClick={() => {
              browserHistory.push({ pathname: `/faculty/${course.discipline}/course/${course.id}` })
            }}
            >Начать обучение
          </div>
        </div>

      </div>
    ))
  }
  render () {
    const { coursesFetched, courses } = this.state
    const { params } = this.props
    if (!coursesFetched) {
      return (<div>Loading...</div>)
    }
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-8 col-md-8'>
            <div className='description text-description'>
              ЗДЕСЬ МЫ ВОСПИТЫВАЕМ СТРАТЕГОВ И МЫСЛИТЕЛЕЙ, РАЗВИВАЕМ ЖИВОСТЬ УМА И РЕАКЦИЮ,
              РАСТИМ ДОСТОЙНЫХ И ЦИВИЛИЗОВАННЫХ ИГРОКОВ. ДОБРО ПОЖАЛОВАТЬ НА ФАКУЛЬТЕТ!
            </div>
          </div>
          <div className='col-sm-4 col-md-4 '>
            <div className='logo-Dota2'>
            </div>
          </div>
          {this.rederCourses()}
          <div className='col-sm-4 col-md-4'>
            <div className='avatar'>
            </div>
          </div>
          <div className='col-sm-8 col-md-8'>
            <div className='reviews text-reviews'>
              {/* <CommentList
                courseId={params.courseId}
              /> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
MainView.propTypes = {
  params: React.PropTypes.object,
  discipline: React.PropTypes.string
}

export default MainView

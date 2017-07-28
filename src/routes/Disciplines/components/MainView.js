import React, { Component } from 'react'
import firebase from 'firebase'
import { browserHistory } from 'react-router'
import './MainView.scss'
import _ from 'lodash'

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
  countVoises (count) {
    if (count % 10 === 1) {
      return ('голос')
    } else {
      const isACount = (count % 10 === 2 || count % 10 === 3 || count % 10 === 4)
      const voises = isACount ? 'голоса' : 'голосов'
      return (voises)
    }
  }

  isFull (number, mark) {
    if (mark * 2 >= number) {
      return true
    } else { return false }
  }

  countStars (mark) {
    const arrayMarkDouble = _.range((mark * 2) + 1)
    return (
      <div className='stars'>

        {!this.isFull(2, mark) && arrayMarkDouble.includes(1) && <div className='starHalf'></div>}
        {this.isFull(2, mark) && arrayMarkDouble.includes(2) && <div className='starFull'></div>}
        {!arrayMarkDouble.includes(1) && <div className='starEmpty'></div>}

        {!this.isFull(4, mark) && arrayMarkDouble.includes(3) && <div className='starHalf'></div>}
        {this.isFull(4, mark) && arrayMarkDouble.includes(4) && <div className='starFull'></div>}
        {!arrayMarkDouble.includes(3) && <div className='starEmpty'></div>}

        {!this.isFull(6, mark) && arrayMarkDouble.includes(5) && <div className='starHalf'></div>}
        {this.isFull(6, mark) && arrayMarkDouble.includes(6) && <div className='starFull'></div>}
        {!arrayMarkDouble.includes(5) && <div className='starEmpty'></div>}

        {!this.isFull(8, mark) && arrayMarkDouble.includes(7) && <div className='starHalf'></div>}
        {this.isFull(8, mark) && arrayMarkDouble.includes(8) && <div className='starFull'></div>}
        {!arrayMarkDouble.includes(7) && <div className='starEmpty'></div>}

        {!this.isFull(10, mark) && arrayMarkDouble.includes(9) && <div className='starHalf'></div>}
        {this.isFull(10, mark) && arrayMarkDouble.includes(10) && <div className='starFull'></div>}
        {!arrayMarkDouble.includes(9) && <div className='starEmpty'></div>}
      </div>
    )
  }
  rederCourses () {
    const { courses } = this.state
    return courses.map((course, i) => (
      <div key={i}>
        <div className='col-sm-4 col-md-4'>
          <div className={`course${i % 3}`}>
            <div className='text-time'>
              {course.duration}
            </div>
            <div className='text-name'>
              {course.name}
            </div>
            <div className='text-course'>
              {course.description}
            </div>

            <div className='text-starMark'>
              {this.countStars(course.starMark)} {course.reviewNumber} {this.countVoises(course.reviewNumber)}
            </div>
          </div>

          <div
            className='btn-start'
            onClick={() => {
              browserHistory.push({ pathname: `/faculty/${course.discipline}/course/${course.id}` })
            }}
            >Начать обучение
            {/* {startButton} */}
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
              {/* {hiWord} */}
            </div>
          </div>
          <div className='col-sm-4 col-md-4 '>
            <div className='logo-Dota2'
              // style={{backgroundImage: url(../../../images/logoDota2.jpg}}
              // logoBannerDota:'',
              // logoBannerCSGO:'',
              // logoBannerLoL:'',
                >
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
                reviews
                reviewsImg
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

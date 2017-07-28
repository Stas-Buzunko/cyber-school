import React, { Component } from 'react'
import StripeComponent from '../../../components/StripeComponent'
import firebase from 'firebase'
import { connect } from 'react-redux'
import './MainView.scss'
import { browserHistory } from 'react-router'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      courses: [],
      coursesFetched: false
    }
  }
  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12 col-md-12 vip-header'></div>
          <div className='col-sm-6 col-md-6 frame'>
            <p style={{ paddingBottom: '10px' }}>СТАНДАРТНЫЙ АККАУНТ</p>
            <p>- ВИДЕО УРОКИ</p>
            <p>- ПРАКТИЧЕСКИЕ ЗАДАНИЯ</p>
            <p>- ТЕСТОВЫЕ ЗАДАНИЯ</p>
            <p>- ОБЩЕНИЕ С ТРЕНЕРАМИ ЧЕРЕЗ ФОРУМ</p>
            <p>- СТАТИСТИКА</p>
            <p>- СОВЕТЫ НА ОСНОВЕ СТАТИСТИКИ</p>
          </div>
          <div className='col-sm-6 col-md-6 vip-frame'>
            <p style={{ paddingBottom: '10px' }}>VIP АККАУНТ</p>
            <p>- ВИДЕО УРОКИ</p>
            <p>- ПРАКТИЧЕСКИЕ ЗАДАНИЯ</p>
            <p>- ТЕСТОВЫЕ ЗАДАНИЯ</p>
            <p>- ОБЩЕНИЕ С ТРЕНЕРАМИ ЧЕРЕЗ ФОРУМ</p>
            <p>- СТАТИСТИКА</p>
            <p style={{ paddingBottom: '5px' }}>- СОВЕТЫ НА ОСНОВЕ СТАТИСТИКИ</p>
            <h1></h1>
            <p>- ПЕРСОНАЛЬНОЕ ОБЩЕНИЕ С ТРЕНЕРОМ ЧЕРЕЗ ЛИЧНЫЕ СООБЩЕНИЯ</p>
            <p>- ПЕРСОНАЛЬНЫЙ ПОДХОД К ВАШИМ ТРЕНИРОВКАМ</p>
            <p>- СОВЕТЫ НА ОСНОВЕ ПРОАНАЛИЗИРОВАННЫХ РЕПЛЕЕВ</p>
          </div>
        </div>
      </div>
    )
  }
}

MainView.propTypes = {
  user: React.PropTypes.object
}
const mapStateToProps = state => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(MainView)

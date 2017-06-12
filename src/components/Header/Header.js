import React, { PropTypes } from 'react'
import { IndexLink, browserHistory } from 'react-router'
import './Header.scss'
import backend from './apis'
import firebase from 'firebase'

export const Header = ({ user }) =>
  <div className='container'>
    <div>
      <a href='/' title='Return to the homepage'>
        <div className='logo'></div>
      </a>
    </div>
    <div className='dropdown firstButton'>
      <div className='navbtn1'>Факультеты</div>
      <div className='dropdown-content firstButton'>
        <a href='/faculty/CS:GO'>CS:GO</a>
        <a href='/faculty/Dota2'>Dota2</a>
        <a href='/faculty/LoL'>LOL</a>
      </div>
    </div>
    <div
      className='navbtn2'
      onClick={() => { browserHistory.push({ pathname: `` }) }}
      >Турниры
    </div>
    <div
      className='navbtn2'
      onClick={() => { browserHistory.push({ pathname: '/forum' }) }}
      >Форум
    </div>
    {!Object.keys(user).length &&
      <div
        className='navbtnLogin'>
        <a href={`${backend}/auth/steam`}> LOGIN </a>
      </div> }

    {Boolean(Object.keys(user).length) &&
        <div className='dropdown'>
          <div className='navbtn4'>{user.displayName}</div>
          <div className='dropdown-content'>
            <a href='/MyCourses'>My courses</a>
            <a href='/statistics'>Statistics</a>
            <a href='/'
               onClick={() => firebase.auth().signOut()}>
            Log out</a>
          </div>
  </div>
  }
  </div>

Header.propTypes = {
  user: PropTypes.object
}

export default Header

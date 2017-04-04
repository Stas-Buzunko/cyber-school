import React, { PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'
import backend from '../../../config/apis'
import firebase from 'firebase'

export const Header = ({ user }) =>
  <div>
    <h1>React Redux Starter Kit</h1>
    <IndexLink to='/' activeClassName='route--active'>
      Home
    </IndexLink>
    {' · '}
    <Link to='/disciplines/dota2' activeClassName='route--active'>
       Dota 2
    </Link>
    {' · '}
    <Link to='/disciplines/cs_go' activeClassName='route--active'>
      CS:GO
    </Link>
    {' · '}
    <Link to='/disciplines/lol' activeClassName='route--active'>
      LOL
    </Link>
    {' · '}
    <Link to='/MyCourses' activeClassName='route--active'>
      MyCourses
    </Link>
    {' · '}
    {!Object.keys(user).length &&
      <a href={`${backend}/auth/steam`}
        className='button'>
        <i className='fa fa-steam fa-space-right' />Sign in with Steam
      </a>
    }
    {Boolean(Object.keys(user).length) &&
      <div>
        <p>{user.displayName}</p>
        <img src={user.avatar} alt='' />
        <a onClick={() => firebase.auth().signOut()}>Log out</a>
      </div>
    }
  </div>

Header.propTypes = {
  user: PropTypes.object
}

export default Header

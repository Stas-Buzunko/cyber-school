import React, { PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'
import backend from '../../../config/apis'

export const Header = ({ user }) => (
  <div>
    <h1>React Redux Starter Kit</h1>
    <IndexLink to='/' activeClassName='route--active'>
      Home
    </IndexLink>
    {' · '}
    <Link to='/disciplines/dota2'>
       Dota 2
    </Link>
    {' · '}
    <Link to='/disciplines/cs_go'>
      CS:GO
    </Link>
    {' · '}
    <Link to='/disciplines/lol'>
      LOL
    </Link>
    {' · '}
    <Link to='/admin' activeClassName='route--active'>
      Admin
    </Link>
    {' · '}
    <Link to='/admin/courses' activeClassName='route--active'>
      Courses
    </Link>
    {' · '}
    {!user &&
      <a href={`${backend}/auth/steam}`}
        className='button'>
        <i className='fa fa-steam fa-space-right' />Sign in with Steam
      </a>
    }
    {user &&
      <div>
        <p>{user.displayName}</p>
        <img src={user.avatar} alt='' />
      </div>
    }
  </div>
)

Header.propTypes = {
  user: PropTypes.object
}

export default Header

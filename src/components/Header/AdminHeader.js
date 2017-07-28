import React, { PropTypes } from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'

export const Header = () =>
  <div>
    <h1>React Redux Starter Kit</h1>
    <IndexLink to='/admin' activeClassName='route--active'>
      User list
    </IndexLink>
    {' · '}
    <Link to='/admin/courses' activeClassName='route--active'>
      Courses
    </Link>
    {' · '}
    <Link to='/admin/siteInfo' activeClassName='route--active'>
      Site information
    </Link>
    {' · '}
  </div>

export default Header

import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'

export const Header = () => (
  <div>
    <h1>React Redux Starter Kit</h1>
    <IndexLink to='/' activeClassName='route--active'>
      Home
    </IndexLink>
    {' · '}
    <Link to='/counter' activeClassName='route--active'>
      Counter
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
  </div>
)

export default Header

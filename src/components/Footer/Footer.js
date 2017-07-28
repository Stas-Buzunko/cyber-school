import React, { PropTypes } from 'react'
import { IndexLink, Link, browserHistory } from 'react-router'
import './Footer.scss'

export const Footer = ({ user }) =>
<div className='row'>
  <div className='footer-block'>
    <div className='container d-flex align-items-start'>
      <a className='block' href='/about'>ABOUT</a>
      <a className='block' href='/becomeacoach'>BECOME A COACH</a>
      <a className='block' href='/vip'>VIP</a>
      <a className='block' href='/support'>SUPPORT</a>
      <a className='block' href='/terms'>TERMS</a>
      <a className='block' href='/coaches'>COACHES</a>
      <a href='http://facebook.com'><p className='fb'></p></a>
      <a href='http://viber.com'><p className='viber'></p></a>
      <a href='http://twitter.com'><p className='twitter'></p></a>
      <a href='http://vk.com' ><p className='vk'></p></a>
    </div>
  </div>
</div>
Footer.propTypes = {
  user: PropTypes.object
}

export default Footer

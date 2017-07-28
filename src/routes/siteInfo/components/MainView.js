import React from 'react'
import HomePage from './HomePage'
import Faculties from './Faculties'
import Faculty from './Faculty'
import Course from './Course'
import Footer from './Footer'
import { Link } from 'react-router'

const MainView = (props) => {
  let content

  switch (props.params.page) {
    case 'faculty':
      content = <Faculty />
      break
    case 'faculties':
      content = <Faculties
        params={props.params} />
      break
      case 'course':
        content = <Course
          params={props.params} />
        break
        case 'footer':
          content = <Footer
            params={props.params} />
          break
    default:
      content = <HomePage />
  }
  return (
    <div>
      <Link to='/admin/siteInfo/homePage' activeClassName='route--active'>HomePage</Link>
      {' · '}
      <Link to='/admin/siteInfo/faculties' activeClassName='route--active'>Faculties</Link>
      {' · '}
      <Link to='/admin/siteInfo/faculty' activeClassName='route--active'>Faculty</Link>
      {' · '}
      <Link to='/admin/siteInfo/course' activeClassName='route--active'>Course</Link>
      {' · '}
      <Link to='/admin/siteInfo/footer' activeClassName='route--active'>Footer</Link>
      {content}
    </div>
  )
}
MainView.propTypes = {
  action: React.PropTypes.string,
  params: React.PropTypes.object
}
export default MainView

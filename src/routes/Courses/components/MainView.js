import React from 'react'
import NewCourse from './NewCourse'
import EditCourse from './EditCourse'
import CoursesList from './CoursesList'
import { Link } from 'react-router'

const MainView = (props) => {
  let content

  switch (props.params.action) {
    case 'new':
      content = <NewCourse />
      break
    case 'edit':
      content = <EditCourse
        params={props.params}
      />
      break
    default:
      content = <CoursesList />
  }
  return (
    <div>
      <Link to='/admin/courses' activeClassName='route--active'>Courses List</Link>
      {' · '}
      <Link to='/admin/courses/new' activeClassName='route--active'>Course New</Link>
      {content}
    </div>
  )
}
MainView.propTypes = {
  action: React.PropTypes.string,
  params: React.PropTypes.object
}
export default MainView

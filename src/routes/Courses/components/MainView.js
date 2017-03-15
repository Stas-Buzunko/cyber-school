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
      content = <EditCourse />
      break
    default:
      content = <CoursesList />
  }

  return (
    <div>
      <Link to='/admin/courses' activeClassName='route--active'>Courses List</Link>
      <Link to='/admin/courses/new' activeClassName='route--active'>Courses New</Link>
      {content}
    </div>
  )
}

export default MainView

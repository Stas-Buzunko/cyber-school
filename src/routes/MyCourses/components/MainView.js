import React from 'react'
import UserCoursesList from '../containers/UserCoursesListContainer'
import { browserHistory } from 'react-router'

const MainView = (props) => {
  if (!Object.keys(props.auth.user).length) {
    browserHistory.push({ pathname: `/` })
  }
  return (
    <div>
      <UserCoursesList />
    </div>
  )
}
MainView.propTypes = {
  user: React.PropTypes.string,
  auth: React.PropTypes.object
}
export default MainView

import React from 'react'
import UserList from '../containers/UserListContainer'
import Login from '../containers/LoginContainer'

const MainView = (props) => {
  let content

  switch (props.auth.authenticated) {
    case true:
      content = <UserList />
      break
    default:
      content = <Login />
  }

  return (
    <div>
      {content}
    </div>
  )
}
MainView.propTypes = {
  authenticated: React.PropTypes.string,
  auth: React.PropTypes.object
}
export default MainView

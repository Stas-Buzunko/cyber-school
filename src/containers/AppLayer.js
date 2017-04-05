import React, { PropTypes } from 'react'
import EmailInput from '../components/EmailInput'
import { Router, browserHistory } from 'react-router'
import { connect } from 'react-redux'

const AppLayer = ({ user, routes }) => {
  if (Object.keys(user).length && !user.email) {
    return (
      <EmailInput id={user.uid} />
    )
  }

  return (
    <div style={{ height: '100%' }}>
      <Router history={browserHistory} children={routes} />
    </div>
  )
}

AppLayer.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(AppLayer)

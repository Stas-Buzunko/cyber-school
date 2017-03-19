import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import { OidcProvider } from 'redux-oidc'
import userManager from '../utils/userManager'

class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { routes, store } = this.props

    return (
      <Provider store={store}>
        <OidcProvider store={store} userManager={userManager}>
          <div style={{ height: '100%' }}>
            <Router history={browserHistory} children={routes} />
          </div>
        </OidcProvider>
      </Provider>
    )
  }
}

export default AppContainer

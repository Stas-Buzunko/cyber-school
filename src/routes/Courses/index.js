import { browserHistory } from 'react-router'

export default (store) => ({
  path : 'admin/courses(/:action)(/:id)',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const state = store.getState()
      const { authenticated } = state.auth

      if (!authenticated) {
        browserHistory.push('/admin')
      }

      const MainView = require('./components/MainView').default
      // const reducer = require('./modules/counter').default

      /*  Add the reducer to the store on key 'counter'  */
      // injectReducer(store, { key: 'counter', reducer })

      /*  Return getComponent   */
      cb(null, MainView)

    /* Webpack named bundle   */
    }, 'admin/courses(/:action)(/:id)')
  }
})

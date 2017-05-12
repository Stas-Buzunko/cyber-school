// import { injectReducer } from '../../../../store/reducers'

export const TestRoute = (store) => ({
  path : 'test/:testId',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */

      const MainView = require('./containers/MainViewContainer').default

      /*  Add the reducer to the store on key 'counter'  */

      /*  Return getComponent   */
      cb(null, MainView)

    /* Webpack named bundle   */
    }, 'test/:testId')
  }
})

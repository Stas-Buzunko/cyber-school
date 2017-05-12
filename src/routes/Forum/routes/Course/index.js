// import { injectReducer } from '../../../store/reducers'
import { GeneralCommentsRoute } from './routes/GeneralComments'
import { LessonCommentsRoute } from './routes/LessonComments'

export const CourseRoute = (store) => ({
  path : 'section/:courseId',
  /*  Async getComponent is only invoked when route matches   */
  indexRoute: {
    getComponent (nextState, cb) {
      /*  Webpack - use 'require.ensure' to create a split point
      and embed an async module loader (jsonp) when bundling   */
      require.ensure([], (require) => {
        /*  Webpack - use require callback to define
        dependencies for bundling   */

        const MainView = require('./MainView').default

        /*  Add the reducer to the store on key 'counter'  */

        /*  Return getComponent   */
        cb(null, MainView)

        /* Webpack named bundle   */
      }, 'section/:courseId')
    }
  },
  childRoutes: [
    GeneralCommentsRoute(store),
    LessonCommentsRoute(store)
  ]
})

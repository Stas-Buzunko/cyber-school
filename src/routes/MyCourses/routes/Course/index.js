// import { injectReducer } from '../../../store/reducers'
import { LessonRoute } from './routes/Lesson'

export const CourseRoute = (store) => ({
  path : 'course/:id',
  /*  Async getComponent is only invoked when route matches   */
  indexRoute: {
    getComponent (nextState, cb) {
      /*  Webpack - use 'require.ensure' to create a split point
      and embed an async module loader (jsonp) when bundling   */
      require.ensure([], (require) => {
        /*  Webpack - use require callback to define
        dependencies for bundling   */

        const MainView = require('./components/MainView').default
        // const reducer = require('./modules/counter').default

        /*  Add the reducer to the store on key 'counter'  */

        /*  Return getComponent   */
        cb(null, MainView)

        /* Webpack named bundle   */
      }, 'course/:id')
    }
  },
  childRoutes: [
    LessonRoute(store)
  ]
})

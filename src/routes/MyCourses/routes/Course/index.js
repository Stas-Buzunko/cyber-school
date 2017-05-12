// import { injectReducer } from '../../../store/reducers'
import { LessonRoute } from './routes/Lesson'
import { TestRoute } from './routes/Test'
import { TestAnswersRoute } from './routes/TestAnswers'
export const CourseRoute = (store) => ({
  path : 'course/:courseId',
  /*  Async getComponent is only invoked when route matches   */
  indexRoute: {
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
      }, 'course/:courseId')
    }
  },
  childRoutes: [
    LessonRoute(store),
    TestRoute(store),
    TestAnswersRoute(store)
  ]
})

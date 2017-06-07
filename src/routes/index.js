// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout'
import AuthLayout from '../layouts/AuthLayout'
import Home from './Home'
import Admin from './Admin'
import Courses from './Courses'
import Disciplines from './Disciplines'
import Login from './Login'
import Course from './Course'
import Lesson from './Lesson'
import MyCourses from './MyCourses'
import VerifyEmail from './VerifyEmail'
import EmailSetup from './EmailSetup'
import Statistics from './Statistics'
import Forum from './Forum'
import About from './About'
import BecomeACoach from './BecomeACoach'
import Faq from './FAQ'
import Support from './Support'
import Terms from './Terms'
import Coaches from './Coaches'
import Faculties from './Faculties'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

const redirectToEmail = (nextState, replace, store) => {
  const state = store.getState()
  const { user } = state.auth

  if (Object.keys(user).length && (!user.email || !user.emailVerified)) {
    replace({
      pathname: '/email_setup',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

const redirectToLanding = (nextState, replace, store) => {
  const state = store.getState()
  const { user } = state.auth

  if (user.emailVerified) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

export const createRoutes = (store) => ([{
  onEnter: (nextState, replace) => redirectToEmail(nextState, replace, store),
  path        : '/',
  component   : CoreLayout,
  indexRoute  : Home,
  childRoutes : [
    Admin(store),
    Courses(store),
    Disciplines(store),
    Login(),
    Course(store),
    Lesson(store),
    MyCourses(store),
    Statistics(store),
    Forum(store),
    About(store),
    BecomeACoach(store),
    Faq(store),
    Support(store),
    Terms(store),
    Coaches(store),
    Faculties(store)

  ]
}, {
  onEnter: (nextState, replace) => redirectToLanding(nextState, replace, store),
  path: '/email_setup',
  component: AuthLayout,
  indexRoute: EmailSetup(store)
}, {
  path: '/verify',
  component: AuthLayout,
  indexRoute: VerifyEmail(store)
},
])

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes

import firebase from 'firebase'
import toastr from 'toastr'
import { onLoginSuccess } from '../actions/auth-actions'

export const login = ({ email, password }) => dispatch => {
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(() => {
    localStorage.setItem('cyber-academy-authenticated', true)
    dispatch(onLoginSuccess())
  })
  .catch(() => toastr.error('Wrong credentials'))
}

import firebase from 'firebase'
import toastr from 'toastr'
import { onLoginSuccess } from '../actions/auth-actions'
import backend from './apis'
import axios from 'axios'

export const login = ({ email, password }) => dispatch => {
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(() => {
    localStorage.setItem('cyber-academy-authenticated', true)
    dispatch(onLoginSuccess())
  })
  .catch(() => toastr.error('Wrong credentials'))
}

export const updateEmail = ({ uid, email }) =>
  axios.post(`${backend}/update`, {
    uid,
    email
  })

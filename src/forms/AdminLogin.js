import React from 'react'
import { Field, reduxForm } from 'redux-form'

const AdminLogin = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <div className='login-modal__email-field flex-row'>
      <Field
        className='input-text flex'
        component='input'
        name='email'
        placeholder='Email'
        type='email' />
    </div>

    <div className='login-modal__password-field flex-row'>
      <Field
        className='input-text flex'
        component='input'
        name='password'
        placeholder='Password'
        type='password' />
    </div>

    <div className='login-modal__buttons flex-col mtm'>
      <button
        className='login-modal__login-button flex bd-btn-primary mbs'
        type='submit'>
        Login
      </button>
    </div>
  </form>
)

// a unique identifier for this form
export default reduxForm({
  form: 'adminlogin'
})(AdminLogin)

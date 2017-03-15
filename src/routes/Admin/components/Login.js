import React from 'react'
import AdminLogin from '../../../forms/AdminLogin'

const Login = ({ onLoginSubmit }) => (
  <div>
    <h3>Login</h3>
    <AdminLogin onSubmit={credentials => onLoginSubmit(credentials)} />
  </div>
)

export default Login

import React from 'react'

export const AuthLayout = ({ children, }) =>
  <div className="wrapper" id="wrapper">
    <div className="container-fluid">
      <div className="row">
        <div className="flex-row flex-hc">
          <h3>Here will be our cool logo</h3>
          {/*<img src={logoImage} height="150" style={{ width: '12rem' }} />*/}
        </div>
      </div>
      <div>
        { children }
      </div>
    </div>
  </div>


export default AuthLayout

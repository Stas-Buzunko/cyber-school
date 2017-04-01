import React from 'react'
import Header from '../../containers/Header'
import AdminHeader from '../../components/Header/AdminHeader'
import './CoreLayout.scss'
import '../../styles/core.scss'

const renderHeader = location => {
  const isAdmin = location.pathname.split('/')[1] === 'admin'

  if (isAdmin) {
    return <AdminHeader />
  }
  return <Header />
}

export const CoreLayout = ({ children, location }) => (
  <div className='container text-center'>
    {renderHeader(location)}
    <div className='core-layout__viewport'>
      {children}
    </div>
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired,
  location: React.PropTypes.object.isRequired
}

export default CoreLayout

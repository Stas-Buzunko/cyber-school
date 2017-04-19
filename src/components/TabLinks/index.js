import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'

const TabLinks = ({ tabs, onClick, currentTab }) =>
  <div className='nav-tabs-wrapper'>
    <ul className='nav nav-tabs' role='tablist'>
      {tabs.map((tabData) =>
        <li className='nav-item' key={tabData.title}>
          <Button
            active={currentTab === tabData.value}
            onClick={() => onClick(tabData.value)}
          >
            { tabData.title }
          </Button>
        </li>
      )}
    </ul>
  </div>

TabLinks.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node.isRequired
    })),
  onClick: PropTypes.func.isRequired
}

export default TabLinks

import React, { Component } from 'react'

class MainView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      courses: [],
      coursesFetched: false
    }
  }

  render () {
    return (
      <div className='row'>
        <div className='col-sm-12 col-md-12 container'>
          <h4>Coaches</h4>
        </div>
      </div>
    )
  }
}

export default MainView

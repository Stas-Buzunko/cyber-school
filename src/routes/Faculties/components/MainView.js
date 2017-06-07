import React, { Component } from 'react'
import firebase from 'firebase'
import { browserHistory } from 'react-router'
import './MainView.scss'

class MainView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      courses: [],
      coursesFetched: false
    }
  }

  componentWillMount () {
  }

  render () {
    return (
      <div className='container'>
        <div className='content'>
          <div className='row'>
            <div className='col-sm-4 col-md-4'>
              <div className='third1'>
              </div>
              <div className='btnEnterFacult'
                onClick={() => { browserHistory.push({ pathname: '/faculty/CS:GO'}) }}
                >
                  Поступить на факультет
                </div>
                <div className='textFrame'>
                  Играй и закрепляй новые навыки
                </div>
            </div>
            <div className='col-sm-4 col-md-4'>
            <div className='third2'>
            </div>
            <div className='btnEnterFacult'
                onClick={() => { browserHistory.push({ pathname: '/faculty/Dota2'}) }}
                >
                  Поступить на факультет
                </div>
                <div className='textFrame'>
                  Получай заслуженные награды
                </div>
            </div>
            <div className='col-sm-4 col-md-4'>
            <div className='third3'>
            </div>
              <div className='btnEnterFacult'
                   onClick={() => { browserHistory.push({ pathname: '/faculty/LoL'}) }}
                    >
                      Поступить на факультет
                    </div>
                    <div className='textFrame'>
                      Получай заслуженные награды
                    </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
MainView.propTypes = {
  params: React.PropTypes.object,
  discipline: React.PropTypes.string
}

export default MainView

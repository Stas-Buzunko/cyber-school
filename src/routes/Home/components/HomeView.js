import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import './HomeView.scss'
import Slider from 'react-slick'
import VideoPlayer from './VideoPlayer'

class HomeView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showVideo: false,
      transactionToChange: {}
    }
  }
  render () {
    const { showVideo } = this.state
    const settings = {
      accessibility: false,
      autoplay: true,
      autoplaySpeed: 3000,
      centerMode: false,
      useCSS: true,
      fade:true,
      arrows: false,
      dots: false,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1
    }
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-12'>
            {!showVideo && <div className='content'>
              {
                <Slider {...settings}>
                  <div className='sliderDota'></div>
                  <div className='sliderCSGO'></div>
                </Slider>
              }
              <div className='row fourQuaters'>
                <div className='col-sm-3 col-md-3'>
                  <div className='quater1'>
                    <div className='text'>
                      Изучи механизм игры и взаимодействие с командой
                      {/* {quaterText1} */}
                    </div>
                  </div>
                </div>
                <div className='col-sm-3 col-md-3'>
                  <div className='quater2'>
                    <div className='text'>
                      Улучши свои навыки и контроль за игрой
                      {/* {quaterText2} */}
                    </div>
                  </div>
                </div>
                <div className='col-sm-3 col-md-3'>
                  <div className='quater3'>
                    <div className='text'>
                      Изучи продвинутые техники профессиональных спортсменов и научись их применять
                      {/* {quaterText3} */}
                    </div>
                  </div>
                </div>
                <div className='col-sm-3 col-md-3'>
                  <div className='quater4'>
                    <div className='text'>
                      Каждый ученик получает право бесплатно попасть на турнир с 2000$ призовых
                      {/* {quaterText4} */}
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-12 col-md-12'>
                  <div className='btnStart'
                       onClick={() => {  browserHistory.push({ pathname: '/faculties'}) }}
                    >
                    Начать обучение
                    {/* {buttonText} */}
                  </div>
                </div>
              </div>
            </div>
          }
            {!!showVideo && <div>
              <div>
                <VideoPlayer
                  url={`https://www.youtube.com/watch?v=fvySzEH85hk`}
                  // url={`linkVideoToParents`}
                />
              </div>
            </div>}
          <button
            type='button'
            className='videoToParents '
            onClick={() => { this.setState({ showVideo: !showVideo }) }}
            >
         </button>
          </div>
        </div>
      </div>
    )
  }
}

export default HomeView

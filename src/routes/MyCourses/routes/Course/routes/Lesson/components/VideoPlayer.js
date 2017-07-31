import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import ReactPlayer from 'react-player'
import './MainView.scss'

class VideoPlayer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      playing: true,
      volume: 0.0,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0
    }
  }
  componentWillReceiveProps (nextProps) {
    this.props.stopVideo !== nextProps.stopVideo && this.playPause()
  }
  renderVideoEnded () {
    const isEnded = true
    this.props.addVideoId(isEnded)
  }
  renderVideoStarted () {
    const isEnded = false
    this.props.addVideoId(isEnded)
  }
  playPause = () => {
    this.setState({ playing: !this.state.playing })
  }
  stop = () => {
    this.setState({ playing: false })
  }
  setVolume = e => {
    this.setState({ volume: parseFloat(e.target.value) })
  }
  setPlaybackRate = e => {
    this.setState({ playbackRate: parseFloat(e.target.value) })
  }
  onSeekMouseDown = e => {
    this.setState({ seeking: true })
  }
  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  }
  onSeekMouseUp = e => {
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
  }
  onProgress = state => {
    if (!this.state.seeking) {
      this.setState(state)
    }
  }
  onClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player))
  }

  format (seconds) {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = this.pad(date.getUTCSeconds())
    if (hh) {
      return `${hh}:${this.pad(mm)}:${ss}`
    }
    return `${mm}:${ss}`
  }

  pad (string) {
    return ('0' + string).slice(-2)
  }

  renderVideo () {
    const { url } = this.props
    const {
      playing,
      volume,
      played,
      loaded,
      duration,
      playbackRate,
      soundcloudConfig
    } = this.state

    return (
      <div>
        <ReactPlayer
          width={830}
          height={420}
          url={url}
          ref={player => { this.player = player }}
          className='react-player'
          playing={playing}
          playbackRate={playbackRate}
          volume={volume}
          soundcloudConfig={soundcloudConfig}
          onStart={() => this.renderVideoStarted()}
          onPlay={() => this.setState({ playing: true })}
          onPause={() => this.setState({ playing: false })}
          onEnded={() => {
            this.renderVideoEnded()
            this.setState({ playing: false })
          }}
          onError={e => console.log('onError', e)}
          onProgress={this.onProgress}
          onDuration={duration => this.setState({ duration })}
        />
      </div>
    )
  }

  render () {
    const { playing, volume, played, duration } = this.state
    const classType = playing ? 'pause' : 'play'
    return (
      <div className='player'>
        {this.renderVideo()}
        <div className='сontrols'>
        <div
          onClick={this.playPause}
          className={classType}>
        </div>
          <time
            dateTime={`P${Math.round(duration * played)}S`}
            className='time'>
            {this.format(duration * played)}
          </time>
          <input
            type='range'
            min={0}
            max={1}
            step='any'
            value={played}
            onMouseDown={this.onSeekMouseDown}
            onChange={this.onSeekChange}
            onMouseUp={this.onSeekMouseUp}
          />
          <time
            dateTime={`P${Math.round(duration * (1 - played))}S`}
            className='time'>
            {this.format(duration * (1 - played))}
          </time>
          <input
            className='volume'
            type='range'
            min={0}
            max={1}
            step='any'
            value={volume}
            onChange={this.setVolume} />
          <div
            onClick={this.onClickFullscreen}
            className='fullscreen'>
          </div>
        </div>
      </div>
    )
  }
}

VideoPlayer.propTypes = {
  url: React.PropTypes.string,
  addVideoId: React.PropTypes.func
}

export default VideoPlayer

import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import screenfull from 'screenfull'
import ReactPlayer from 'react-player'

class VideoPlayer extends Component {
  constructor (props) {
    super(props)
    this.state = {

      playing: true,
      volume: 0.6,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0
    }
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

    // const videoId = url.replace('https://youtu.be/', '')
    return (
      <div>
        <ReactPlayer
          // url={`https://www.youtube.com/embed/${videoId}`}
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
    const { playing, volume, played } = this.state
    return (
      <div >

        {this.renderVideo()}
        <div className='col-xs-12 col-md-12' style={{ padding: '25px' }}>
          <table><tbody>
            <tr>
              <th>Controls</th>
              <td>
                <button onClick={this.stop}>Stop</button>
                <button onClick={this.playPause}>{playing ? 'Pause' : 'Play'}</button>
                <button onClick={this.onClickFullscreen}>Fullscreen</button>
                <button onClick={this.setPlaybackRate} value={1}>1</button>
                <button onClick={this.setPlaybackRate} value={1.5}>1.5</button>
                <button onClick={this.setPlaybackRate} value={2}>2</button>
              </td>
            </tr>
            <tr>
              <th>Seek</th>
              <td>
                <input
                  type='range' min={0} max={1} step='any'
                  value={played}
                  onMouseDown={this.onSeekMouseDown}
                  onChange={this.onSeekChange}
                  onMouseUp={this.onSeekMouseUp}
                />
              </td>
            </tr>
            <tr>
              <th>Volume</th>
              <td>
                <input type='range' min={0} max={1} step='any' value={volume} onChange={this.setVolume} />
              </td>
            </tr>
          </tbody></table>
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

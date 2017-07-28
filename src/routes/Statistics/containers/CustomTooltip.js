import React, { Component } from 'react'
import moment from 'moment'

class CustomTooltip extends Component {
  constructor (props) {
    super(props)

    this.state = {

    }
  }
  render () {
    const { label, data, period } = this.props
    if (period === 'week') {
      const value = data.filter(item => item.date === label)[0] ?
      data.filter(item => item.date === label)[0].value : 0
      const n = data.filter(item => item.date === label)[0] ?
      data.filter(item => item.date === label)[0].n : 0
      return (
        <div>
          <div>Value: {value}</div>
          <div>Number of games: {n}</div>
          <div>Day: {moment(label).format('dddd')} </div>
        </div>
      )
    } else if (period === 'day') {
      const value = data.filter(item => item.n === label)[0] ?
      data.filter(item => item.n === label)[0].value : 0
      return (
        <div>
          <div>Value: {value}</div>
          <div>Number of games: {label}</div>
          <div>Day: {moment(label).format('dddd')} </div>
        </div>
      )
    } else if (period === 'monthAndAllTime') {
      const value = data.filter(item => item.date === label)[0] ?
      data.filter(item => item.date === label)[0].value : 0
      const n = data.filter(item => item.date === label)[0] ?
      data.filter(item => item.date === label)[0].n : 0
      return (
        <div>
          <div>Value: {value}</div>
          <div>Number of games: {n}</div>
          <div>Day: {moment(label).format('DD/MM')} </div>
        </div>
      )
    }
  }
}

export default CustomTooltip

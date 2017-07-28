import React, { Component } from 'react'
import TabLinks from '../../../components/TabLinks'
import axios from 'axios'
import { connect } from 'react-redux'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import moment from 'moment'
import firebase from 'firebase'
import CustomTooltip from './CustomTooltip'
class Statistics extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentTab: 'totals',
      data: [],
      userData: {},
      field: 'kda',
      period: 'allTime',
      periodDataChart: [],
      daysArray: []
    }
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData () {
    const { user } = this.props
    const { field } = this.state
    this.setState({
      userData: [],
      userDataLoaded: false
    })
    firebase.database().ref('users/' + user.uid)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const userData = object.statistics.chartStatistic ? object.statistics.chartStatistic : []
        const userDataArray = Object.values(userData)
        this.setState({ userDataArray, userDataLoaded: true })
        this.countFieldDataChart(field)
      } else {
        this.setState({ userDataLoaded: true })
      }
    })
  }
  cutPoints (data, periodCount) {
    const { period } = this.state
    if (period === 'day') {
      return data
    } else if (period === 'week') {
      let set = new Set()
      data.forEach(item => {
        if (!set.has(moment(item.date).format(periodCount[`${period}`]))) {
          set.add(moment(item.date).format(periodCount[`${period}`]))
          item.dayValue = item.value
        }
      })
      data[data.length - 1].dayValue = data[data.length - 1].value
      console.log(data, set, Date.now())
      return data
    } else {
      return data
    }
  }

  renderChart (data = []) {
    const { period, userDataLoaded } = this.state
    const isDayChart = (period === 'day')
    const isWeekChart = (period === 'week')
    const periodCount = {
      day: 'dddd',
      week: 'dddd',
      month: 'DD/MM',
      allTime: 'MM/YY'
    }

    const timeAway = {
      day: (24 * 60 * 60 * 1000),
      week: (7 * 24 * 60 * 60 * 1000),
      month:(30 * 24 * 60 * 60 * 1000),
      allTime: (10 * 12 * 30 * 24 * 60 * 60 * 1000)
    }
    const newData = data.filter(item => { return item.date > (Date.now() - timeAway[`${period}`]) })
    const newDataWithPoints = this.cutPoints(newData, periodCount)
    const dateFormatMonthAndAllTime = (time) => {
      return moment(time).format(periodCount[`${period}`])
    }

    const dateFormatWeek = (time) => {
      if (!!data.filter(item => item.date === time)[0].dayValue) {
        return moment(time).format(periodCount[`${period}`])
      }
    }
    return (
      <div>
        {userDataLoaded && !newData.length && <div> No data for this period</div>}
        {!!newData.length && isDayChart && !isWeekChart &&
          <LineChart width={1100} height={400} data={newDataWithPoints}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
            <XAxis dataKey='n' stroke='white' />
            <YAxis dataKey='value' stroke='yellow' />
            <Tooltip content={<CustomTooltip data={newDataWithPoints} period='day' />} />
            <Line type='linear' dataKey='value' stroke='yellow' strokeWidth={3} />
          </LineChart>
        }
        {!!newData.length && !isDayChart && !isWeekChart &&
          <LineChart width={1100} height={400} data={newDataWithPoints}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
            <XAxis dataKey='date' stroke='white' tickFormatter={dateFormatMonthAndAllTime}
              interval={Math.floor(data.length / 14)} />
            <YAxis dataKey='value' stroke='yellow' />
            <Tooltip content={<CustomTooltip data={newDataWithPoints} period='monthAndAllTime' />} />
            <Line type='linear' dataKey='value' stroke='yellow' strokeWidth={3} />
          </LineChart>
        }
        {!!newData.length && isWeekChart &&
          <LineChart width={1100} height={400} data={newDataWithPoints}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
            <XAxis dataKey='date' stroke='white' tickFormatter={dateFormatWeek} />
            <YAxis dataKey='value' stroke='yellow' />
            <Tooltip content={<CustomTooltip data={newDataWithPoints} period='week' />} />
            <Line type='linear' dataKey='value' stroke='yellow' strokeWidth={3} />
            <Line type='linear' connectNulls={true} dataKey='dayValue' stroke='blue' strokeWidth={3} />
          </LineChart>
        }
      </div>
    )
  }
  countFieldDataChart = (field) => {
    const { userDataArray = [] } = this.state
    const dataField = userDataArray ? userDataArray.find(item => item.field === field) : []
    const fieldDataChart = dataField ? dataField.values : []
    this.setState({ fieldChartData: fieldDataChart })
  }

  renderData () {
    const { userDataArray = [], fieldChartData, field } = this.state
    if (!userDataArray) {
      return <div>Loading...</div>
    }
    return (
        <div className='container'>
          <div className='content'>
            <div className='row'>
              <div className='col-sm-4 col-md-4'>
                {userDataArray.map((item, i) => <div key={i}>
                  <button
                    type='button'
                    className='btn btn-success lg'
                    onClick={() => {
                      this.setState({ field : item.field })
                      this.countFieldDataChart(item.field)
                    }}
                    >
                    {item.name}
                  </button>
                </div>)}
                <button
                  type='button'
                  className='btn btn-success lg'
                  onClick={() => {
                    this.setState({ period : 'day' })
                    this.countFieldDataChart(field)
                  }
                }
                >
                  Statistic for day
                </button>

                <button
                  type='button'
                  className='btn btn-success lg'
                  onClick={() => {
                    this.setState({ period : 'week' })
                    this.countFieldDataChart(field)
                  }
                }
                >
                  Statistic for week
                </button>

                <button
                  type='button'
                  className='btn btn-success lg'
                  onClick={() => {
                    this.setState({ period : 'month' })
                    this.countFieldDataChart(field)
                  }
                }
                >
                  Statistic for mounth
                </button>

                <button
                  type='button'
                  className='btn btn-success lg'
                  onClick={() => {
                    this.setState({ period : 'allTime' })
                    this.countFieldDataChart(field)
                  }
                }
                >
                  All time statistic
                </button>

                {this.renderChart(fieldChartData)}
              </div>
            </div>
          </div>
        </div>
      )
    }
  render () {
    return (
      <div>
        {this.renderData()}
      </div>
    )
  }
  }

const mapDispatchToProps = state => ({
  user: state.auth.user
})

export default connect(mapDispatchToProps)(Statistics)

import React, { Component } from 'react'
import TabLinks from '../../../components/TabLinks'
import axios from 'axios'
import { connect } from 'react-redux'
import { Table } from 'react-bootstrap'

class Statistics extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentTab: 'totals',
      data: []
    }
  }

  componentDidMount () {
    this.fetchData('totals')
  }

  changeTab = newTab => {
    this.setState({ currentTab: newTab })
    this.fetchData(newTab)
  }

  fetchData (currentTab) {
    const { user } = this.props
    axios.get(`https://api.opendota.com/api/players/${user.dotaId}/${currentTab}`)
    .then(({ data }) => this.setState({ data }))
  }

  renderData () {
    const { data, currentTab } = this.state

    if (!data.length) {
      return <div>Loading...</div>
    }

    if (currentTab === 'totals') {
      return (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <td />
              {data.map(({ field }, i) => <td key={i}>{field}</td>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total:</td>
              {data.map(({ sum }, i) => <td key={i}>{Math.ceil(sum)}</td>)}
            </tr>
            <tr>
              <td>Average:</td>
              {data.map(({ sum, n }, i) => <td key={i}>{Math.ceil(sum / n) || 0}</td>)}
            </tr>
          </tbody>
        </Table>
      )
    } else if (currentTab === 'rankings') {
      return (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <td>Hero id</td>
              <td>Rank</td>
              <td>Card</td>
            </tr>
          </thead>
          <tbody>
            {data.map(({ hero_id, rank, card }, i) =>
              <tr key={i}>
                <td>{hero_id}</td>
                <td>{rank}</td>
                <td>{card}</td>
              </tr>
            )}
          </tbody>
        </Table>
      )
    } else {
      return (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key, i) => <td key={i}>{key}</td>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) =>
              <tr key={i}>
                {Object.keys(row).map((key, i) => <td key={i}>{row[key]}</td>)}
              </tr>
            )}
          </tbody>
        </Table>
      )
    }
  }

  render () {
    const links = [
      { title: 'Totals', value: 'totals' },
      { title: 'Skill bracket', value: 'rankings' },
      { title: 'All matches', value: 'matches' }
    ]
    const { currentTab } = this.state

    return (
      <div>
        <TabLinks tabs={links} onClick={this.changeTab} currentTab={currentTab} />
        {this.renderData()}
      </div>
    )
  }
}

const mapDispatchToProps = state => ({
  user: state.auth.user
})

export default connect(mapDispatchToProps)(Statistics)

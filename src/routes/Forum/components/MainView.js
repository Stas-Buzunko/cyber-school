import React, { Component, PropTypes } from 'react'
import firebase from 'firebase'
import { Link } from 'react-router'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      forumSections: [],
      sectionsLoaded: false
    }
  }

  componentWillMount () {
    this.fetchItems()
  }

  fetchItems () {
    this.setState({
      forumSections: [],
      sectionsLoaded: false
    })
    firebase.database().ref('forumSections/')
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const forumSections = Object.keys(object).map(id => ({ ...object[id], id }))
        this.setState({ forumSections, sectionsLoaded: true })
        this.fetchInfo()
      } else {
        this.setState({ sectionsLoaded: true })
      }
    })
  }

  fetchInfo () {
    const { forumSections } = this.state
    const promises = forumSections.map(item => {
      return firebase.database().ref('courses/' + item.id)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        const courseFromId = object
        if (object !== null) {
          item.discipline = courseFromId.discipline
          item.name = courseFromId.name
          return (item)
        } else {
          this.setState({ sectionsLoaded: true })
        }
      })
    })
    Promise.all(promises).then(result => {
      console.log(result)
      this.setState({
        forumSections: result,
        forumSectionsLoaded: true
      })
    })
  }

  renderSectionsList (filteredForumSections) {
    const { location } = this.props
    return filteredForumSections.map((item, i) =>
      <tr key={i}>
        <td className='text-left'>
          <Link to={{ pathname: `${location.pathname}/section/${item.id}` }}>{item.name}</Link>
        </td>
      </tr>
    )
  }

  renderTable (discipline) {
    const { forumSections = [] } = this.state
    const filteredForumSections = forumSections.filter((item) =>
      item.discipline === discipline)
    return <div>
      {!!filteredForumSections.length &&
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {this.renderSectionsList(filteredForumSections)}
          </tbody>
        </table>
      }
      {/* {!filteredForumSections.length && <div className='text-left'> No sections </div>} */}
    </div>
  }

  render () {
    return (
      <div className='col-xs-12 col-md-12'>
        <div className='col-xs-12 col-md-8'>
          <label className='control-label col-xs-2 col-md-3' style={{ padding: '15px' }}>Sections</label>
          <label className='control-label col-xs-2 col-md-12' style={{ padding: '30px' }}>Dota 2</label>
          {this.renderTable('Dota2')}
          <label className='control-label col-xs-2 col-md-12' style={{ padding: '30px' }}>CS:GO</label>
          {this.renderTable('CS:GO')}
          <label className='control-label col-xs-2 col-md-12' style={{ padding: '30px' }}>League of Legends</label>
          {this.renderTable('LoL')}
        </div>
      </div>
    )
  }
}

MainView.propTypes = {
  location: PropTypes.object
}

export default MainView

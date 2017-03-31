import React, { Component } from 'react'
import firebase from 'firebase'
import moment from 'moment'

class UserList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      users: []
    }
  }

  componentWillMount () {
    firebase.database().ref('users').once('value')
    .then(snapshot => {
      const object = snapshot.val()

      if (object !== null) {
        const users = Object.keys(object).map(id => ({ ...object[id], id }))

        this.setState({ users })
      }
    })
  }

  renderUsers () {
    const { users } = this.state

    return users.map((user, i) =>
      <tr key={i}>
        <td>{user.displayName}</td>
        <td>{moment(user.timecreated, 'X').format('L')}</td>
        <td>{moment(user.timeRegistered, 'X').format('L')}</td>
      </tr>
    )
  }

  render () {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Registred in Steam</th>
              <th>Registred in Academy</th>
            </tr>
          </thead>
          <tbody>
            {this.renderUsers()}
          </tbody>
        </table>
      </div>
    )
  }
}

export default UserList

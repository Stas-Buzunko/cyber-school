import React, { Component } from 'react'
import firebase from 'firebase'

class CommentList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comments: [],
      subSections: []
    }
  }

  componentWillMount () {
    const { lessonId, courseId } = this.props
    this.fetchItems(courseId, lessonId)
  }

  fetchItems (courseId, lessonId) {
    this.setState({
      comments: []
    })
    firebase.database().ref('forumSections/' + courseId)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        if (object.subSections) {
          const comments = object.subSections[`${lessonId}`] || []
          this.setState({ comments, object })
        } else {
          this.setState({ object })
        }
      }
    })
  }

  renderChildrenList (item) {
    return (
      item.children.map((child, i) =>
        <div key={i} className='col-xs-12 col-md-12'>
          <div className='col-xs-12 col-md-4'>
            <div className='col-xs-12 col-md-4'>{item.displayName}</div>
            <div className='col-xs-12 col-md-4'><img style={{ borderRadius:'50%' }} src={item.avatar} /> </div>
          </div>
          <div className='col-xs-12 col-md-3'>{child} </div>
        </div>
     ))
  }

  renderCommentList () {
    const { comments = [] } = this.state
    const isRespond = true
    return comments.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-10 col-md-3'>
            <div className='col-xs-10 col-md-3'>{item.displayName}</div>
            <div className='col-xs-10 col-md-3'><img style={{ borderRadius:'50%' }} src={item.avatar} /> </div>
          </div>
          <div className='col-xs-10 col-md-3' style={{ borderRadius:'50%' }}>{item.text} </div>
        </div>
        { item.children && <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-12 col-md-2'>
          </div>
          <div className='col-xs-10 col-md-8'>
            {this.renderChildrenList(item)}
          </div>
        </div>}
      </li>
    )
  }

  render () {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-12' style={{ padding: '15px' }}>
            <label className='control-label col-xs-2 col-md-2'>Comments:</label>
            <ul className='list-unstyled'>
              {this.renderCommentList()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

CommentList.propTypes = {
  lessonId: React.PropTypes.string,
  courseId: React.PropTypes.string
}

export default CommentList

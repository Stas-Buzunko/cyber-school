import React, { Component } from 'react'
import firebase from 'firebase'

class CommentList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      generalQuestions: [],
      generalQuestionsLoaded: false
    }
    this.renderCommentList = this.renderCommentList.bind(this)
    this.renderChildrenList = this.renderChildrenList.bind(this)
  }

  componentWillMount () {
    const { courseId } = this.props
    this.fetchItems(courseId)
  }

  fetchItems (courseId) {
    this.setState({
      generalQuestions: [],
      generalQuestionsLoaded: false,
      forumSection: {}
    })
    firebase.database().ref('forumSections/' + courseId)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const generalQuestions = object.generalQuestions
        this.setState({ generalQuestions, generalQuestionsLoaded: true })
      } else {
        this.setState({ generalQuestionsLoaded: true })
      }
    }
  )
  }

  renderChildrenList (item) {
    return item.children.map((child, i) =>
      <div key={i} className='col-xs-12 col-md-12'>
        <div className='col-xs-12 col-md-4'>
          <div className='col-xs-12 col-md-4'>{item.displayName}</div>
          <div className='col-xs-12 col-md-4'><img style={{ borderRadius:'50%' }} src={item.avatar} /> </div>
        </div>
        <div className='col-xs-12 col-md-3 text-left'>{child} </div>
      </div>)
  }

  renderCommentList () {
    const { generalQuestions = [] } = this.state
    return generalQuestions.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
          <div className='col-xs-10 col-md-4'>
            <div className='col-xs-10 col-md-2'>{item.displayName}</div>
            <div className='col-xs-10 col-md-2'><img style={{ borderRadius:'50%' }} src={item.avatar} /> </div>
          </div>
          <div className='col-xs-10 col-md-3 text-left'>{item.text} </div>
        </div>
        {item.children && <div className='col-xs-12 col-md-12' style={{ padding: '15px' }} >
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
          </div>
          <div className='col-xs-12 col-md-12'>
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
  courseId: React.PropTypes.string
}

export default CommentList

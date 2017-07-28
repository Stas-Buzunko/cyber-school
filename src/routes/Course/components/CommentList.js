import React, { Component } from 'react'
import firebase from 'firebase'
import Infinite from 'react-infinite'

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
      <div key={i}>
        <div className='col-xs-10 col-md-10'>
          <div className='reply-name'>{item.displayName}</div>
        </div>
        <div className='col-xs-10 col-md-10'>
        <div>
          <div className='reply-text'>{child} </div>
          </div>
        </div>
      </div>
    )
  }

  renderCommentList () {
    const { generalQuestions = [] } = this.state
    return generalQuestions.map((item, i) =>
      <li key={i}>
        <div className='col-xs-12 col-md-12 comment'>
          <div className='col-xs-1 col-md-1 comment-avatar'>
            <div><img style={{ borderRadius:'10%' }} className='comment-avatar' src={item.avatar} /></div>
          </div>
          <div className='col-xs-10 col-md-10'>
            <div className='comments-name'>{item.displayName}</div>
            <div className='col-xs-10 col-md-10'>
              <div className='comments-text'>{item.text} </div>
            </div>
            {item.children && <div> {this.renderChildrenList(item)} </div>}
          </div>
        </div>
      </li>
  )
  }

  render () {
    return (
      <div>
        <Infinite containerHeight={200} elementHeight={60} className='scroll'>
          <ul className='list-unstyled'>
            {this.renderCommentList()}
          </ul>
        </Infinite>
      </div>
    )
  }
}

CommentList.propTypes = {
  courseId: React.PropTypes.string
}

export default CommentList

import React, { Component, PropTypes } from 'react'
import firebase from 'firebase'
import CommentList from '../containers/CommentListContainer'
import { show, hide } from 'redux-modal'
import { connect } from 'react-redux'
import toastr from 'toastr'

class MainView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      forumSection: [],
      sectionLoaded: false,
      generalQuestions: [],
      generalQuestionsLoaded: false,
      subSections: [],
      subSectionsLoaded: false
    }
    this.saveComment = this.saveComment.bind(this)
  }

  componentWillMount () {
    const { courseId } = this.props.params
    this.fetchItem(courseId)
  }

  fetchItem (courseId) {
    this.setState({
      forumSections: [],
      sectionsLoaded: false
    })
    firebase.database().ref('forumSections/' + courseId)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const forumSection = object
        this.setState({
          generalQuestions: forumSection.generalQuestions,
          subSections: forumSection.subSections,
          sectionLoaded: true })
        this.fetchInfo(courseId)
      } else {
        this.setState({ sectionLoaded: true })
      }
    })
  }

  fetchInfo (courseId) {
    const { forumSection } = this.state
    firebase.database().ref('courses/' + courseId)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      forumSection.discipline = object.discipline
      forumSection.name = object.name
      this.setState({ forumSection })
    })
  }
  saveComment = (comment, isRespond, item, type, lessonId) => {
    const { user } = this.props.auth
    const { courseId } = this.props.params
    const isCourse = type === 'course'
    const isLesson = type === 'lesson'

    if (isCourse) {
      this.setState({
        generalQuestions: []
      })
      firebase.database().ref('forumSections/' + courseId)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        if (object !== null) {
          const generalQuestions = object.generalQuestions
          this.setState({ generalQuestions })
        }
      })
      .then(() => {
        const { generalQuestions = [] } = this.state
        if (!isRespond) {
          const commentStructure = {
            text: comment,
            children:[],
            uid: user.uid,
            displayName: user.displayName,
            avatar: user.avatar
          }
          const newGeneralQuestions = [ ...generalQuestions, commentStructure ]
          this.setState({ generalQuestions: newGeneralQuestions })
          console.log(this.state.generalQuestions)
        } else {
          const respond = comment
          if (!item.children) {
            item.children = []
          }
          const newCommentChildrenArray = [
            ...item.children,
            respond
          ]
          const indexItemToRemove = generalQuestions.findIndex(comment => item.text === comment.text)
          const newComment = {
            text : generalQuestions[indexItemToRemove].text,
            children: newCommentChildrenArray,
            uid: user.uid,
            displayName: user.displayName,
            avatar: user.avatar
          }
          const newArray = [
            ...generalQuestions.slice(0, indexItemToRemove),
            newComment,
            ...generalQuestions.slice(indexItemToRemove + 1)
          ]
          this.setState({ generalQuestions: newArray })
        }
      })
      .then(() => {
        const { generalQuestions } = this.state
        firebase.database().ref('forumSections/' + courseId).update({ generalQuestions })
      })
      .then(() => {
        this.props.hideModal('comment')
        if (!isRespond) {
          toastr.success('Your comment saved!')
        } else {
          toastr.success('Your respond saved!')
        }
      })
    } else if (isLesson) {
      this.setState({
        comments: []
      })
      firebase.database().ref('forumSections/' + courseId)
      .once('value')
      .then(snapshot => {
        const object = snapshot.val()
        if (object !== null) {
          const subSections = object.subSections
          if (subSections) {
            const comments = object.subSections[`${lessonId}`] || []
            this.setState({ comments })
          }
        }
      })
      .then(() => {
        const { comments = [] } = this.state
        if (!isRespond) {
          const commentStructure = {
            text: comment,
            children:[],
            uid: user.uid,
            displayName: user.displayName,
            avatar: user.avatar
          }
          const newComments = [ ...comments, commentStructure ]
          this.setState({ comments: newComments })
        } else {
          const respond = comment
          if (!item.children) {
            item.children = []
          }
          const newCommentChildrenArray = [
            ...item.children,
            respond
          ]
          const indexItemToRemove = comments.findIndex(comment => item.text === comment.text)
          const newComment = {
            text : comments[indexItemToRemove].text,
            children: newCommentChildrenArray,
            uid: user.uid,
            displayName: user.displayName,
            avatar: user.avatar
          }
          const newArray = [
            ...comments.slice(0, indexItemToRemove),
            newComment,
            ...comments.slice(indexItemToRemove + 1)
          ]
          this.setState({ comments: newArray })
        }
      })
      .then(() => {
        const { comments, subSections } = this.state
        const newSubSections = !!subSections ? subSections : {}
        newSubSections[`${lessonId}`] = comments
        this.setState({ subSections: newSubSections })
        firebase.database().ref('forumSections/' + courseId).update({ subSections: newSubSections })
      })
      .then(() => {
        this.props.hideModal('comment')
        if (!isRespond) {
          toastr.success('Your comment saved!')
        } else {
          toastr.success('Your respond saved!')
        }
      })
    }
  }

  render () {
    const { forumSection, generalQuestions, subSections } = this.state
    console.log(subSections)
    return (
      <div className='col-xs-12 col-md-12'>
        <div className='col-xs-12 col-md-8'>
          <label className='control-label col-xs-2 col-md-12' style={{ padding: '15px' }}>{forumSection.name}</label>
          <div className='col-xs-12 col-md-10'>
            <ul className='list-unstyled'>
              <CommentList
                generalQuestions={generalQuestions}
                subSections={subSections}
                saveComment={this.saveComment}
              />
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

MainView.propTypes = {
  params: PropTypes.object,
  hideModal: React.PropTypes.func,
  user: React.PropTypes.object,
  auth: React.PropTypes.object
}

const mapDispatchToProps = {
  openModal: show,
  hideModal: hide
}

export default connect(
  null,
  mapDispatchToProps
)(MainView)

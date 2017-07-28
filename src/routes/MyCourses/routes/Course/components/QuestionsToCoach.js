import React, { Component } from 'react'
import firebase from 'firebase'
import toastr from 'toastr'
import Infinite from 'react-infinite'
import moment from 'moment'
import './MainView.scss'

class QuestionsToCoach extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userQuestionsToCoach: [],
      userQuestionsToCoachLoaded: false,
      disciplines : {
        'Dota2': 'Dota2',
        'LoL': 'LoL',
        'CS:GO': 'CsGo'
      },
      discipline: '',
      disciplineLoaded: false,
      chat: {},
      chatLoaded: false,
      messages: [],
      message: ''

    }
    this.renderCommentList = this.renderCommentList.bind(this)
  }

  componentWillMount () {
    const { courseId } = this.props
    const { user } = this.props.auth
    this.fetchItems(courseId, user)
    this.fetchCourse(courseId)
    this.chatListener()

  }

  fetchCourse (courseId) {
    this.setState({
      discipline: '',
      disciplineLoaded: false
    })
    firebase.database().ref('courses/' + courseId)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const discipline = object.discipline
        this.setState({ discipline, disciplineLoaded: true })
      } else {
        this.setState({ disciplineLoaded: true })
      }
    })
  }

  fillChat () {
    const { user } = this.props.auth
    const { courseId } = this.props
    const Dota2 = { messages:
      [{ user: 'coach', date: Date.now(), text: 'Hello, I am your coach. You can ask me everything about Dota2' }] }
    const LoL = { messages:
      [{ user: 'coach', date: Date.now(), text: 'Hello, I am your coach. You can ask me everything about LoL' }] }
    const CsGo = { messages:
      [{ user: 'coach', date: Date.now(), text: 'Hello, I am your coach. You can ask me everything about CSGO' }] }
    const chat = { Dota2, LoL, CsGo }
    firebase.database().ref('chats/' + user.uid).update({ chat: chat })
    this.fetchItems(courseId, user)
  }

  fetchItems (courseId, user) {
    this.setState({
      chat: {},
      chatLoaded: false
    })
    firebase.database().ref('chats/' + user.uid)
    .once('value')
    .then(snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const chat = object.chat || {}
        this.setState({ chat, chatLoaded: true })
      } else {
        this.fillChat()
      }
    }
  )
  }

  renderCommentList () {
    const { chat = {}, discipline, disciplines } = this.state
    const newDiscipline = disciplines[`${discipline}`]
    if (chat[`${newDiscipline}`] !== []) {
      return chat[`${newDiscipline}`].messages.map((item, i) =>
        <li key={i}>
          <div className='col-xs-12 col-md-12'>
            {/* <div><img style={{ borderRadius:'10%' }} className='comment-avatar' src={item.avatar} /></div> */}
            <div className='col-xs-12 col-md-12'>
              <div style={{ color:'lightBlue' }}>{item.user}</div>
              <div style={{ color:'#7bb4d7' }}>{ moment(item.date).toNow() }</div>
            </div>
            <div style={{ color:'white' }} className='col-xs-12 col-md-12'>
              {item.text}
            </div>
          </div>
        </li>
      )
    }
  }

  saveComment = () => {
    const { user } = this.props.auth
    const { message, disciplines, discipline, chat } = this.state
    const newDiscipline = disciplines[`${discipline}`]
    const messages = chat[`${newDiscipline}`].messages
    const messageStructure = {
      text: message,
      date: Date.now(),
      user: user.displayName
    }
    const newMessages = [ ...messages, messageStructure ]
    this.setState({ messages: newMessages })
    const newChat = { ...chat }
    newChat[`${newDiscipline}`].messages = newMessages
    this.setState({ message: ''})
    firebase.database().ref('chats/' + user.uid).update({ chat: newChat })
    .then(() => {
      toastr.success('Your message saved!')
    })
  }

  saveCommentClick = () => {
    const { message } = this.state
    this.setState({ error: '' })
    if (message === '') {
      toastr.error('Please, fill your message')
      return false
    }
    this.saveComment()
  }

  chatListener () {
    const { user } = this.props.auth
    const { disciplines, discipline, chatLoaded } = this.state
    firebase.database().ref('chats/' + user.uid)
    .on('value', snapshot => {
      const object = snapshot.val()
      if (object !== null) {
        const chat = object.chat || {}
        this.setState({ chat })
        const newDiscipline = disciplines[`${discipline}`]
        if (chatLoaded) {
          if (chat[`${newDiscipline}`].messages[chat[`${newDiscipline}`].messages.length].user === 'coach') {
            toastr.success('New message')
          }
        }
      }
    })
  }

  render () {
    const { disciplineLoaded, chatLoaded } = this.state
    return (
      <div>
        <div className='chat-field'>
          <Infinite containerHeight={225} elementHeight={20} className='scroll' >
            <div>
            <ul className='list-unstyled'>
              {chatLoaded && disciplineLoaded && this.renderCommentList()}
            </ul>
            <div id='box'
              ref={(el) => { this.messagesEnd = el }} ></div>
            </div>
          </Infinite>
          <div>
            ​<textarea
              type='textarea'
              className='chat-input'
              value={this.state.message}
              cols='50'
              rows='3'
              onChange={(e) => this.setState({ message: e.target.value })}>
            </textarea>
          </div>
        </div>
        <div
          className='chat-button'
          onClick={this.saveCommentClick}
          >Ask question
        </div>
      </div>
    )
  }
  }

QuestionsToCoach.propTypes = {
  courseId: React.PropTypes.string,
  user: React.PropTypes.object,
  auth: React.PropTypes.object
}

export default QuestionsToCoach

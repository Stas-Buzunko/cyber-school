import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { connectModal } from 'redux-modal'

class LessonPopup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lesson: {
        name: '',
        description: '',
        length: '',
        imageUrl: '',
        videoUrl: '',
        isFree: '',
        testId: '',
        comments: ''
      },
      error: ''
    }
  }
  render () {
    const { show, handleHide, message } = this.props
    return (
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Hello</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          { message }
        </Modal.Body>

        <Modal.Footer>
          <button onClick={handleHide}>Close</button>
          <button bsStyle="primary" onClick={this.handleClose}>Save changes</button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectModal({
  name: 'lesson'
})(LessonPopup)

//       <Modal
//         backdrop={true}
//         dialogClassName="login-modal"
//         onHide={handleHide}
//         show={show}>
//         <i className="icon-cross2 modal-close color-white" onClick={handleHide} />
//         <Modal.Body>
//           <div className="flex-row">
//             <div className="login-modal__bg hide-mobile" >
//               <div className="flex flex-col flex-vc pam">
//                 Hello
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     )
//   }
// }
// export default LessonPopup

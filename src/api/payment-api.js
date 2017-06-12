import axios from 'axios'
import backend from './apis'
import toastr from 'toastr'

export const pay = ({ token, amount, courseId, userId }) => dispatch => {
  axios.post(`${backend}/charge`, {
    token,
    amount,
    courseId,
    userId
  })
  .then(() => toastr.success('Payment is successful'))
  .catch(() => toastr.error('Payment failed, please check your card details and balance'))
}

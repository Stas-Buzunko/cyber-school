import axios from 'axios'
import backend from '../../config/apis'
import toastr from 'toastr'

export const pay = ({ token, amount, courseId, userId, isVip }) => dispatch => {
  axios.post(`${backend}/charge`, {
    token,
    amount,
    courseId,
    userId,
    isVip
  })
  .then(() => toastr.success('Payment is successful'))
  .catch(() => toastr.error('Payment failed, please check your card details and balance'))
}

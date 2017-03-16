import axios from 'axios'
import backend from '../../config/apis'
import toastr from 'toastr'

export const pay = ({ token, amount }) => dispatch => {
  console.log(token, amount)
  axios.post(`${backend}/charge`, {
    token,
    amount
  })
  .then(() => toastr.success('Payment is successful'))
  .catch(() => toastr.error('Payment failed, please check your card details and balance'))
}

const successResponse = id => ({
  status: 'success',
  id
})

const declinedResponse = ({ id, message }) => ({
  status: 'declined',
  message,
  id
})

const errorResponse = ({ id, message }) => ({
  status: 'error',
  message,
  id
})

module.exports = { successResponse, declinedResponse, errorResponse }

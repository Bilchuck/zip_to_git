const { authToken: AUTH_TOKEN } = require('./config')

const checkToken = (req, res, next) => {
  const requestToken = req.body.token
  if (requestToken === AUTH_TOKEN) {
    next()
  } else {
    res.send({
      success: false,
      message: 'Token is not valid!'
    })
  }
}

module.exports = {
  checkToken
}

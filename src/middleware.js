const checkToken = (req, res, next) => {
  const SECRET_TOKEN = process.env.TOKEN
  const token = req.body.token
  if (token === SECRET_TOKEN) {
    next()
  } else {
    res.send({
      success: false,
      error: 'Token is not valid!'
    })
  }
}

module.exports = {
  checkToken
}

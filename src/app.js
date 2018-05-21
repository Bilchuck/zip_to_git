const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { checkToken } = require('./middleware')
require('dotenv').config()

const PORT = process.env.PORT

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.post('/project_name/', checkToken, (req, res) => {
  res.send({
    success: true
  })
})

app.listen(PORT, _ => {
  console.log(`The server is started on ${PORT} port!`)
})

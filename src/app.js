const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()

const PORT = process.env.PORT

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('OK')
})

app.listen(PORT, _ => {
  console.log(`The server is started on ${PORT} port!`)
})

const express = require('express')
const { checkToken } = require('./middleware')
const multer = require('multer')
const { port, fileInputPath } = require('./config')
const { updateRepoController } = require('./controllers')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, fileInputPath)
  },
  filename: function (req, file, cb) {
    const project = req.body.project
    const now = new Date().toISOString()
    cb(null, project + '__' + now)
  }
})
const upload = multer({ storage })
const app = express()

// api
app.post('/project_name/', upload.single('zip'), checkToken, updateRepoController)

// start server
app.listen(port, _ => {
  console.log(`The server is started on ${port} port!`)
})

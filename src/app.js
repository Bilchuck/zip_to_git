require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { checkToken } = require('./middleware')
const fs = require('fs')
const multer = require('multer')
const unzip = require('unzip')
const AdmZip = require('adm-zip')

const fileOutputPath = path.join(__dirname, '../output')
const fileInputPath = path.join(__dirname, '../inputs/')

var storage = multer.diskStorage({
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

const PORT = process.env.PORT

app.post('/project_name/', upload.single('zip'), checkToken, (req, res) => {
  const file = req.file

  const zip = new AdmZip(file.path)

  zip.extractAllTo(fileOutputPath, true)

  res.send({
    success: true
  })
})

app.listen(PORT, _ => {
  console.log(`The server is started on ${PORT} port!`)
})

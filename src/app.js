require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { checkToken } = require('./middleware')
const multer = require('multer')
const {
  gitClone,
  emptyFolder,
  unzip,
  moveFiles,
  gitFolderName,
  gitCommit,
  gitAdd,
  gitPush
} = require('./utils')

const gitOutputPath = path.join(__dirname, '../git_output')
const zipOutputPath = path.join(__dirname, '../zip_output')
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

const { PORT } = process.env

app.post('/project_name/', upload.single('zip'), checkToken, (req, res) => {
  const unzipFolder = path.join(zipOutputPath, req.file.originalname.split('.zip')[0])
  const gitFolder = path.join(gitOutputPath, gitFolderName(req.body.gitUrl))
  emptyFolder(gitOutputPath)
    .then(_ => emptyFolder(zipOutputPath))
    .then(_ => gitClone(req.body.gitUrl, gitOutputPath))
    .then(_ => unzip(req.file.path, zipOutputPath))
    .then(_ => moveFiles(unzipFolder, gitFolder))
    .then(_ => gitAdd(gitFolder))
    .then(_ => gitCommit(gitFolder))
    .then(_ => gitPush(gitFolder))
    .then(_ => {
      res.send({
        success: true
      })
    }).catch(error => {
      console.log(`Error with cloning repo ${error}!`)
      res.send({
        success: false
      })
    })
})

app.listen(PORT, _ => {
  console.log(`The server is started on ${PORT} port!`)
})

const {
  gitClone, emptyFolder, unzip, moveFiles, gitFolderName, gitCommit, gitAdd, gitPush, makeLog
} = require('../utils')
const { gitOutputPath, zipOutputPath } = require('../config')
const path = require('path')

const updateRepoController = (req, res) => {
  const log = makeLog()
  const unzipFolder = path.join(zipOutputPath, req.file.originalname.split('.zip')[0])
  const gitFolder = path.join(gitOutputPath, gitFolderName(req.body.gitUrl))

  log(`Recieve zip archieve from ${req.body.project} project.`)
    .then(_ => emptyFolder(gitOutputPath))
    .then(_ => emptyFolder(zipOutputPath))
    .then(_ => gitClone(req.body.gitUrl, gitOutputPath))
    .then(_ => unzip(req.file.path, zipOutputPath))
    .then(_ => moveFiles(unzipFolder, gitFolder))
    .then(_ => gitAdd(gitFolder))
    .then(_ => gitCommit(gitFolder))
    .then(_ => gitPush(gitFolder))
    .then(_ => log(`Success! Sending response..`))
    .then(_ => {
      res.send({
        success: true
      })
    }).catch(error => {
      log(`Error handled!`)
      log(error)
      res.send({
        success: false
      })
    })
}

module.exports = { updateRepoController }

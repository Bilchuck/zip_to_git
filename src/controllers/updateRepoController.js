const {
  gitClone, emptyFolder, unzip, moveFiles, gitFolderName,
  gitCommit, gitAdd, gitPush, makeLog, NoChangesError
} = require('../utils')
const GitService = require('../services/gitService')
const { gitOutputPath, zipOutputPath } = require('../config')
const path = require('path')

module.exports = class UpdateAdidasRepoController {
  run (req, res) {
    const { file: { originalname, path: filePath } } = req
    const { log, id: logId } = makeLog(this.project)
    const unzipFolder = path.join(zipOutputPath, originalname.split('.zip')[0])
    const gitFolder = path.join(gitOutputPath, gitFolderName(this.gitUrl))
    const gitService = new GitService(this.gitUrl, gitOutputPath, gitFolder)

    return log(`Recieve zip archieve to commit.`)
      .then(_ => emptyFolder(gitOutputPath))
      .then(_ => emptyFolder(zipOutputPath))
      .then(_ => gitService.clone())
      .then(_ => unzip(filePath, zipOutputPath))
      .then(_ => moveFiles(unzipFolder, gitFolder))
      .then(_ => gitService.add())
      .then(_ => gitService.commit())
      .then(_ => gitService.push())
      .then(_ => log(`Success! Sending response..`))
      .then(_ => res.send({ logId, success: true }))
      // error handler
      .catch(error => {
        if (error instanceof NoChangesError) {
          return log(`No changes detected.`)
            .then(_ => res.send({
              message: error.message,
              logId,
              success: false
            }))
        } else {
          return log(`Unexpected Error handled!`)
            .then(_ => log(error))
            .then(_ => res.send({
              logId,
              success: false
            }))
        }
      })
  }
}

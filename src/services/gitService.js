const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { NoChangesError } = require('../utils')
const { gitUser, gitPass } = require('../config')

const isNoChangesError = message => message.indexOf('nothing to commit, working tree clean') !== -1
const transformUrl = url => {
  const https = 'https://'
  const rest = url.split(https)[1]
  return `${https}${gitUser}:${gitPass}@${rest}`
}

module.exports = class GitService {
  constructor (repoUrl, pathToClone, projectPath) {
    this.repoUrl = repoUrl
    this.pathToClone = pathToClone
    this.projectPath = projectPath
  }
  add () {
    return exec(`git add .`, { cwd: this.projectPath })
  }
  clone () {
    return exec(`git clone ${transformUrl(this.repoUrl)}`, { cwd: this.pathToClone })
  }
  commit () {
    return exec(`git commit -m "server-update: update from server"`, { cwd: this.projectPath })
      .catch(error => {
        if (error.stdout && isNoChangesError(error.stdout)) {
          return Promise.reject(new NoChangesError(`No changes to commit`))
        } else {
          return Promise.reject(error)
        }
      })
  }
  push () {
    return exec(`git push`, { cwd: this.projectPath })
  }
  getFolderName () {
    return this.gitUrl.split(`/${gitUser}/`)[1].split('.git')[0]
  }
}


const { NoChangesError } = require('./error')
const { gitUser, gitPass } = require('../config')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const isNoChangesError = message => message.indexOf('nothing to commit, working tree clean') !== -1
const transformUrl = url => {
  const https = 'https://'
  const rest = url.split(https)[1]
  return `${https}${gitUser}:${gitPass}@${rest}`
}

const gitClone = (gitUrl, path) => exec(`git clone ${transformUrl(gitUrl)}`, { cwd: path })
const gitFolderName = gitUrl => gitUrl.split(`/${gitUser}/`)[1].split('.git')[0]
const gitAdd = path => exec(`git add .`, { cwd: path })
const gitCommit = path => exec(`git commit -m "server-update: update from server"`, { cwd: path })
  .catch(error => error.stdout && isNoChangesError(error.stdout)
    ? Promise.reject(new NoChangesError(`No changes to commit`))
    : Promise.reject(error))
const gitPush = path => exec(`git push`, { cwd: path })

module.exports = {
  gitClone,
  gitFolderName,
  gitAdd,
  gitCommit,
  gitPush
}

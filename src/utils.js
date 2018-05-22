const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { gitUser, gitPass, logFilePath } = require('./config')
const fs = require('fs')

const appendFile = util.promisify(fs.appendFile)

// helpers
const transformUrl = url => {
  const https = 'https://'
  const rest = url.split(https)[1]
  return `${https}${gitUser}:${gitPass}@${rest}`
}
const isNoChangesError = message => message.indexOf('nothing to commit, working tree clean') !== -1

// file structure
const emptyFolder = path => exec(`rm -rf *`, { cwd: path })
const unzip = (input, out) => exec(`tar xvf ${input} -C ${out}`)
const moveFiles = (from, to) => exec(`cp -r ${from}/. ${to}`)

// git operations
const gitClone = (gitUrl, path) => exec(`git clone ${transformUrl(gitUrl)}`, { cwd: path })
const gitFolderName = gitUrl => gitUrl.split(`/${gitUser}/`)[1].split('.git')[0]
const gitAdd = path => exec(`git add .`, { cwd: path })
const gitCommit = path => exec(`git commit -m "server-update: update from server"`, { cwd: path })
  .catch(error => error.stdout && isNoChangesError(error.stdout)
    ? Promise.reject(new CustomError(`No changes to commit`))
    : Promise.reject(error))
const gitPush = path => exec(`git push`, { cwd: path })

// logs
const log = message => appendFile(logFilePath, message, 'utf8')
const makeLog = _ => {
  const id = Math.random().toString().split('.')[1]
  return message => {
    const now = new Date().toISOString()
    return log(`${id} | ${now} | ${message}\n`)
  }
}

// error
class CustomError extends Error {}

module.exports = {
  gitClone,
  emptyFolder,
  unzip,
  moveFiles,
  gitFolderName,
  gitAdd,
  gitCommit,
  gitPush,
  log,
  makeLog,
  CustomError
}

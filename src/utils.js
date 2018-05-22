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
// file structure
const emptyFolder = path => exec(`rm -rf *`, { cwd: path })
const unzip = (input, out) => exec(`tar xvf ${input} -C ${out}`)
const moveFiles = (from, to) => exec(`cp -r ${from}/. ${to}`)

// git operations
const gitClone = (gitUrl, path) => exec(`git clone ${transformUrl(gitUrl)}`, { cwd: path })
const gitFolderName = gitUrl => gitUrl.split(`/${gitUser}/`)[1].split('.git')[0]
const gitAdd = path => exec(`git add .`, { cwd: path })
const gitCommit = path => exec(`git commit -m "server-update: update from server"`, { cwd: path })
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
  makeLog
}

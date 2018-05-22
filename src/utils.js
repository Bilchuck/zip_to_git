require('dotenv').config()
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { GIT_USER, GIT_PASS } = process.env

const transformUrl = url => {
  const https = 'https://'
  const rest = url.split(https)[1]
  return `${https}${GIT_USER}:${GIT_PASS}@${rest}`
}
const gitClone = (gitUrl, path) => exec(`git clone ${transformUrl(gitUrl)}`, {
  cwd: path
})
const emptyFolder = path => exec(`rm -rf *`, {
  cwd: path
})

const unzip = (input, out) => {
  return exec(`tar xvf ${input} -C ${out}`)
}

const moveFiles = (from, to) => {
  return exec(`cp -r ${from}/. ${to}`)
}

const gitFolderName = gitUrl => gitUrl.split(`/${GIT_USER}/`)[1].split('.git')[0]
const gitAdd = path => exec(`git add .`, {
  cwd: path
})
const gitCommit = path => exec(`git commit -m "server-update: update from server"`, {
  cwd: path
})
const gitPush = path => exec(`git push`, {
  cwd: path
})
module.exports = {
  gitClone,
  emptyFolder,
  unzip,
  moveFiles,
  gitFolderName,
  gitAdd,
  gitCommit,
  gitPush
}

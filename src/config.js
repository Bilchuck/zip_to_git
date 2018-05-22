
require('dotenv').config()
const path = require('path')

const { PORT, GIT_USER, GIT_PASS, AUTH_TOKEN } = process.env
const rootPath = path.join(__dirname, '../')
const gitOutputPath = path.join(rootPath, 'git_output')
const zipOutputPath = path.join(rootPath, 'zip_output')
const fileInputPath = path.join(rootPath, 'inputs')
const logFilePath = path.join(rootPath, 'log.txt')

module.exports = {
  port: PORT,
  gitUser: GIT_USER,
  gitPass: GIT_PASS,
  authToken: AUTH_TOKEN,
  gitOutputPath,
  zipOutputPath,
  fileInputPath,
  logFilePath
}

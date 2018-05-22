
require('dotenv').config()
const path = require('path')

const { PORT, GIT_USER, GIT_PASS } = process.env
const gitOutputPath = path.join(__dirname, '../git_output')
const zipOutputPath = path.join(__dirname, '../zip_output')
const fileInputPath = path.join(__dirname, '../inputs/')

module.exports = {
  port: PORT,
  gitUser: GIT_USER,
  gitPass: GIT_PASS,
  gitOutputPath,
  zipOutputPath,
  fileInputPath
}

const { appendFile } = require('./file_utils')
const { logFilePath } = require('../config')

const log = message => {
  return appendFile(logFilePath, message, 'utf8')
}
const makeLog = project => {
  const id = Math.random().toString().split('.')[1]
  return {
    log: message => {
      const now = new Date().toISOString()
      return log(`${id} | ${project} | ${now} | ${message}\n`)
    },
    id
  }
}

module.exports = {
  makeLog
}

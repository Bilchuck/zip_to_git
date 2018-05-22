const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')
const appendFile = util.promisify(fs.appendFile)
const readFile = util.promisify(fs.readFile)

const emptyFolder = path => exec(`rm -rf *`, { cwd: path })
const unzip = (input, out) => exec(`tar xvf ${input} -C ${out}`)
const moveFiles = (from, to) => exec(`cp -r ${from}/. ${to}`)

module.exports = {
  appendFile,
  emptyFolder,
  moveFiles,
  readFile,
  unzip
}

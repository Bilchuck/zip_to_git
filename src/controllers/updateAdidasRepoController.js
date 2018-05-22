const updateRepoController = require('./updateRepoController')
const { adidasGitUrl } = require('../config')

module.exports = class updateAdidasRepoController extends updateRepoController {
  constructor () {
    super()
    this.project = 'adidas'
    this.gitUrl = adidasGitUrl
  }
}

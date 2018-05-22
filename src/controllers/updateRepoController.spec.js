/* eslint-env mocha */
const sinon = require('sinon')
const mock = require('mock-require')
const { CustomError } = require('../utils')

const mockLog = sinon.stub()
const mockUtils = {
  gitClone: sinon.stub(),
  emptyFolder: sinon.stub(),
  unzip: sinon.stub(),
  moveFiles: sinon.stub(),
  gitFolderName: sinon.stub(),
  gitCommit: sinon.stub(),
  gitAdd: sinon.stub(),
  gitPush: sinon.stub(),
  makeLog: sinon.stub(),
  CustomError
}
mockLog.resolves()
mockUtils.gitClone.resolves()
mockUtils.emptyFolder.resolves()
mockUtils.unzip.resolves()
mockUtils.moveFiles.resolves()
mockUtils.gitFolderName.returns('test')
mockUtils.gitCommit.resolves()
mockUtils.gitAdd.resolves()
mockUtils.gitPush.resolves()
mockUtils.makeLog.returns(mockLog)

// mocking utils module
mock('../utils', mockUtils)
const { updateRepoController } = require('./updateRepoController')

const mockReq = {
  body: {
    project: 'TEST',
    gitUrl: 'https://github.com/test_user/test.git'
  },
  file: {
    originalname: 'test.zip'
  }
}
const mockRes = {
  send: sinon.spy()
}

describe('updateRepoController', _ => {
  it('should be runned', done => {
    updateRepoController(mockReq, mockRes)
      .then(_ => {
        done()
      }).catch(err => {
        sinon.throws(err)
        done()
      })
  })
  it('should call utils function in right order', done => {
    updateRepoController(mockReq, mockRes)
      .then(_ => {
        sinon.assert.callOrder(
          mockUtils.makeLog,
          mockLog,
          mockUtils.emptyFolder,
          mockUtils.emptyFolder,
          mockUtils.gitClone,
          mockUtils.unzip,
          mockUtils.moveFiles,
          mockUtils.gitAdd,
          mockUtils.gitCommit,
          mockUtils.gitPush,
          mockLog,
          mockRes.send
        )
        sinon.assert.calledWithMatch(mockRes.send, { success: true })
        done()
      })
  })
  it('should return message if CustomError was throwed', done => {
    const errorMessage = 'abc'
    mockUtils.gitPush.rejects(new CustomError(errorMessage))
    updateRepoController(mockReq, mockRes)
      .then(_ => {
        sinon.assert.calledWithMatch(mockRes.send, { message: errorMessage, success: false })
        done()
      })
  })
})

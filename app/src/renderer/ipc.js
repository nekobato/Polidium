const { ipcRenderer } = require('electron')
const types = require('root/mutation-types')

module.exports = {
  commit (type, payload) {
    ipcRenderer.send(types.CONNECT_COMMIT, type, JSON.stringify(payload))
  }
}

const ipcRenderer = require('electron').ipcRenderer

module.exports = {
  commit (type, payload) {
    ipcRenderer.send('CONNECT_COMMIT', type, payload)
  }
}

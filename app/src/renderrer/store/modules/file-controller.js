const types = require('root/mutation-types')
const ipcRenderer = require('electron').ipcRenderer

module.exports = {
  mutations: {  },
  actions: {
    [types.PLAY_FILE] (index) {
      ipcRenderer.send(types.COMMIT, types.PLAY_FILE, { index: index })
    }
  }
}

const Vue = require('vue')
const Vuex = require('vuex')
const types = require('root/mutation-types')
const ipcRenderer = require('electron').ipcRenderer

Vue.use(Vuex)

const DEBUG = process.env.NODE_ENV !== 'production'

Vue.config.debug = DEBUG ? true : false

module.exports = new Vuex.Store({
  state: {
    player: ipcRenderer.sendSync(types.CONNECT_STATE),
    file: {
      queues: []
    }
  },
  mutations: {
    [types.DROP_FILE] (state, files) {
      for (file of files) {
        if (file.type === 'video/mp4') {
          state.file.queues.push(file)
        }
      }
    },
    [types.PLAY_FILE] (state, index) {
      ipcRenderer.send('CONNECT_COMMIT', types.PLAY_FILE, JSON.stringify(state.file.queues[index].path))
    }
  },
  strict: DEBUG
})

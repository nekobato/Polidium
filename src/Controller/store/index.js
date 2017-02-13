const Vue = require('vue')
const Vuex = require('vuex')
const types = require('root/mutation-types')
const fileModule = require('./modules/file')
const ipcRenderer = require('electron').ipcRenderer

Vue.use(Vuex)

const DEBUG = process.env.NODE_ENV !== 'production'

Vue.config.debug = DEBUG ? true : false

module.exports = new Vuex.Store({
  state: {
    modules: {
      file: fileModule
    },
    // player: ipcRenderer.sendSync(types.CONNECT_STATE),
    file: {
      queues: []
    },
    settings: {
      opacity: 0.05,
      clickThrough: true,
      displays: [1,2,3]
    }
  }
  strict: DEBUG
})
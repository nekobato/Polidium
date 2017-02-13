const { ipcRenderer } = require('electron')
const Vue = require('vue')
const Vuex = require('vuex')
const types = require('root/mutation-types')

Vue.use(Vuex)

const DEBUG = process.env.NODE_ENV !== 'production'

Vue.config.debug = DEBUG ? true : false

module.exports = new Vuex.Store({
  modules: {
    'fileController': require('./modules/file-controller'),
    'webController': require('./modules/web-controller'),
    'videoPlayer': require('./modules/video-player'),
    'webPlayer': require('./modules/web-player'),
    'settings': require('./modules/settings')
  },
  state: ipcRenderer.sendSync(types.CONNECT_STATE),
  strict: DEBUG
})

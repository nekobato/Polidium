const { ipcRenderer } = require('electron')
const Vue = require('vue')
const Vuex = require('vuex')

Vue.use(Vuex)

const DEBUG = process.env.NODE_ENV !== 'production'

Vue.config.debug = DEBUG ? true : false

module.exports = new Vuex.Store({
  state: ipcRenderer.sendSync(types.CONNECT_STATE),
  strict: DEBUG
})

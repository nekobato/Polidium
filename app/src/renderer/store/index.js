const { ipcRenderer } = require('electron')
const Vue = require('vue')
const Vuex = require('vuex')
const types = require('root/mutation-types')

Vue.use(Vuex)

const DEBUG = process.env.NODE_ENV !== 'production'

Vue.config.debug = DEBUG ? true : false

const store = new Vuex.Store({
  modules: {
    'video': require('./modules/video'),
    'web': require('./modules/web'),
    'settings': require('./modules/settings')
  },
  strict: DEBUG
})

ipcRenderer.on(types.CONNECT_COMMIT, (event, typeName, payload) => {
  console.log(typeName, payload)
  store.commit(typeName, JSON.parse(payload))
})

module.exports = store

const { BrowserWindow, ipcMain } = require('electron')
const Vue = require('vue')
const Vuex = require('vuex')
const types = require('root/mutation-types')

Vue.use(Vuex)

const DEBUG = process.env.NODE_ENV !== 'production'

Vue.config.debug = DEBUG ? true : false

const clients = []

const store = new Vuex.Store({
  state: {
    file: {
      queues: []
    },
    settings: {
      opacity: 0.05,
      clickThrough: true,
      displays: [1,2,3]
    },
    video: {
      src: '',
      controls: false
    },
    web: {
      src: ''
    }
  },
  mutations: {
    [types.DROP_FILE] (state, file) {
      state.file.queues.push(file)
    },
    [types.PLAY_FILE] (state, index) {
      // ipcRenderer.send('CONNECT_COMMIT', types.PLAY_FILE, JSON.stringify(state.file.queues[index].path))
    }
  },
  middlewares: [{
    onMutation (mutation, state) {
      Object.keys(clients).forEach((id) => {
        clients[id].send('vuex-apply-mutation', mutation)
      })
    }
  }],
  strict: DEBUG
})

ipcMain.on(types.CONNECT_STATE, (event) => {
  let winId = BrowserWindow.fromWebContents(event.sender).id
  console.log('[background] vuex-connect', winId)

  clients[winId] = event.sender
  event.returnValue = store.state
})

ipcMain.on(types.CONNECT_COMMIT, (event, type, payload) => {
  console.log(type, payload)
  store.commit(type, JSON.parse(payload))
})

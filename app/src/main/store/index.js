const { ipcMain } = require('electron')
const Vue = require('vue')
const Vuex = require('vuex')
const types = require('root/mutation-types')
const fileModule = require('./modules/file')

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
    [types.DROP_FILE] (state, files) {
      for (file of files) {
        if (file.type === 'video/mp4') {
          state.file.queues.push(file)
        }
      }
    },
    [types.PLAY_FILE] (state, index) {
      // ipcRenderer.send('CONNECT_COMMIT', types.PLAY_FILE, JSON.stringify(state.file.queues[index].path))
    }
  },
  strict: DEBUG
})

ipcMain.on('CONNECT_STATE', (event) => {
  let winId = BrowserWindow.fromWebContents(event.sender).id
  console.log('[background] vuex-connect', winId)

  clients[winId] = event.sender
  event.returnValue = store.state
})

ipcMain.on('CONENCT_COMMIT', (event, type, payload) => {
  // store.commit(type, payload)
  player.win.webContents.send('COMMIT', type, payload)
  controller.win.webContents.send('COMMIT', type, payload)
})

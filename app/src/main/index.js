"use strict"

const { app, Tray, nativeImage, globalShortcut, ipcMain } = require('electron')

const DEBUG = process.env.DEBUG ? true : false

const PlayerWindow = require('./player')
const ControllerWindow = require('./controller')

if (!DEBUG) app.dock.hide()

app.on('ready', () => {

  var player = new PlayerWindow()
  var controller = new ControllerWindow()

  var trayIcon = nativeImage.createFromPath(__dirname + '/img/tray_icon.png')
  var tray = new Tray(trayIcon)

  tray.on('click', (event, bounds) => {
    controller.toggle(bounds.x)
  })

  player.show()

  ipcMain.on('EXIT', (event) => {
    app.quit()
  })

  ipcMain.on('CHANGE_THROUGTH', (event, toggle) => {
    player.win.setIgnoreMouseEvents(toggle)
    player.win.setAlwaysOnTop(toggle)
    player.win.setVisibleOnAllWorkspaces(toggle)
    player.win.webContents.send('CHANGE_THROUGTH', toggle)
  })

  require('./store')

  Vue.use(Vuex)

  const store = new Vuex.Store({
    state: {
      mode: 'FilePlayer',
      settings: {
        display: 1,
        x: 0,
        y: 0,
        width: '100%',
        height: '100%',
        mode: 'file',
        opacity: 0.1,
        through: true
      }
    },
    middlewares: [{
      onMutation (mutation, state) {
        // player.win.webContents.send('CONNECT_COMMIT', type, mutation)
        // controller.win.webContents.send('CONNECT_COMMIT', type, mutation)
      }
    }]
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

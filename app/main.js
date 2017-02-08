"use strict"

const electron = require('electron')
const { app, Tray, nativeImage, globalShortcut, ipcMain } = require('electron')
const Vue = require('vue')
const Vuex = require('vuex')

const DEBUG = process.env.DEBUG ? true : false

if (DEBUG) require('electron-debug')({ showDevTools: true })

const PlayerWindow = require('./player')
const ControllerWindow = require('./controller')

if (!DEBUG) app.dock.hide()

app.on('ready', function() {

  var player = new PlayerWindow()
  var controller = new ControllerWindow()

  var trayIcon = nativeImage.createFromPath(__dirname + '/img/tray_icon.png')
  var tray = new Tray(trayIcon)

  tray.on('click', function(event, bounds) {
    controller.toggle(bounds.x)
  })

  player.show()

  ipcMain.on('EXIT', function(event) {
    app.quit()
  })

  ipcMain.on('CHANGE_THROUGTH', (event, toggle) => {
    player.win.setIgnoreMouseEvents(toggle)
    player.win.setAlwaysOnTop(toggle)
    player.win.setVisibleOnAllWorkspaces(toggle)
    player.win.webContents.send('CHANGE_THROUGTH', toggle)
  })

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

  ipcMain.on('STATE', (event) => {
    event.returnValue = store.state
  })

  ipcMain.on('COMMIT', (event, type, payload) => {
    // store.commit(type, payload)
    player.win.webContents.send('COMMIT', type, payload)
    controller.win.webContents.send('COMMIT', type, payload)
  })
})

app.on('will-quit', function() {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

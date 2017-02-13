"use strict"

const { app, Tray, nativeImage, globalShortcut, ipcMain } = require('electron')

const DEBUG = process.env.DEBUG ? true : false
const types = require('root/mutation-types')
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

  ipcMain.on(types.CONNECT_STATE, (event) => {
    console.log('[background] vuex-connect', winId)
    event.returnValue = store.state
  })

  ipcMain.on(types.CONNECT_COMMIT, (event, typeName, payload) => {
    console.log(typeName, payload)
    player.win.webContents.send(types.CONNECT_COMMIT, typeName, payload)
    controller.win.webContents.send(types.CONNECT_COMMIT, typeName, payload)
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

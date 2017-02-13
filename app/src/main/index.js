"use strict"

const { app, Tray, nativeImage, globalShortcut, ipcMain } = require('electron')

const DEBUG = process.env.DEBUG ? true : false

const PlayerWindow = require('./player')
const ControllerWindow = require('./controller')
require('./store')

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
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

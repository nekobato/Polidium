"use strict"

const electron = require('electron')
const {app} = electron
const {Tray} = electron
const {nativeImage} = electron
const {globalShortcut} = electron
const {ipcMain} = electron

const DEBUG = process.env.DEBUG ? true : false

if (DEBUG) {
  require('electron-debug')({showDevTools: true})
}

const PlayerWindow = require('./player')
const ControllerWindow = require('./controller')

let tray, trayIcon, player, controller

app.dock.hide()

app.on('ready', function() {

  player = new PlayerWindow()
  controller = new ControllerWindow()

  trayIcon = nativeImage.createFromPath(__dirname + '/img/tray_icon.png')
  tray = new Tray(trayIcon)

  tray.on('click', function(event, bounds) {
    controller.toggle(bounds.x)
  })

  player.show()

  ipcMain.on('controller:close-application', function(event) {
    app.quit()
  })

  ipcMain.on('controller:ipc-bridge', function(event, channel, data) {
    player.win.webContents.send('main:ipc-bridge', channel, data)
  })

  ipcMain.on('controller:toggle-player', (event) => {
    var toggleTo = player.win.isAlwaysOnTop() ? false : true
    player.win.setIgnoreMouseEvents(toggleTo)
    player.win.setAlwaysOnTop(toggleTo)
    player.win.setVisibleOnAllWorkspaces(toggleTo)
    player.win.webContents.send('main:toggle-player', toggleTo)
  })
})

app.on('login', function(event, webContents, request, authInfo, callback) {
  event.preventDefault()
  callback('', '')
})

app.on('will-quit', function() {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

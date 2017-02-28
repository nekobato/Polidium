"use strict"

const electron = require('electron')
const { app, Tray, nativeImage, globalShortcut, ipcMain } = electron

const DEBUG = process.env.DEBUG ? true : false
const types = require('root/mutation-types')
const PlayerWindow = require('./player')
const ControllerWindow = require('./controller')

if (!DEBUG) app.dock.hide()

app.on('ready', () => {

  var screen = electron.screen

  var player = new PlayerWindow()
  var controller = new ControllerWindow()

  var trayIcon = nativeImage.createFromPath(__dirname + '/img/tray_icon.png')
  var tray = new Tray(trayIcon)

  tray.on('click', (event, bounds) => {
    controller.toggle(bounds.x)
  })

  player.show()

  ipcMain.on(types.CONNECT_STATE, (event) => {
    event.returnValue = store.state
  })

  ipcMain.on(types.CONNECT_SCREEN, (event) => {
    event.returnValue = screen.getAllDisplays()
  })

  ipcMain.on(types.CONNECT_COMMIT, (event, typeName, payload) => {
    console.log(typeName, payload)
    player.win.webContents.send(types.CONNECT_COMMIT, typeName, payload)
    controller.win.webContents.send(types.CONNECT_COMMIT, typeName, payload)

    if (typeName === types.QUIT) app.quit()

    if (typeName === types.SET_CLICKTHROUGH) {
      const parsedPayload = JSON.parse(payload)
      player.win.setIgnoreMouseEvents(parsedPayload.clickThrough)
      player.win.setAlwaysOnTop(parsedPayload.clickThrough)
      player.win.setVisibleOnAllWorkspaces(parsedPayload.clickThrough)
    }

    if (typeName === types.SELECT_DISPLAY) {

    }
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

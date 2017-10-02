"use strict"

const electron = require('electron')
const { app, Tray, nativeImage, globalShortcut, ipcMain } = electron
const os = require('os')
const types = require('root/mutation-types')
const PlayerWindow = require('./player')
const ControllerWindow = require('./controller')

const DEBUG = process.env.DEBUG ? true : false
const MAC = os.type() === 'Darwin' ? true : false

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

  ipcMain.on(types.CONNECT_COMMIT, (event, typeName, payload) => {
    if (DEBUG) console.log(typeName, payload)
    player.win.webContents.send(types.CONNECT_COMMIT, typeName, payload)
    controller.win.webContents.send(types.CONNECT_COMMIT, typeName, payload)

    if (typeName === types.QUIT) app.quit()

    if (typeName === types.SET_CLICKTHROUGH) {
      const parsedPayload = JSON.parse(payload)
      player.win.setIgnoreMouseEvents(parsedPayload.clickThrough)
      player.win.setAlwaysOnTop(parsedPayload.clickThrough)
      if (MAC) player.win.setVisibleOnAllWorkspaces(parsedPayload.clickThrough)
    }

    if (typeName === types.RESIZE_PLAYER) {
      const parsedPayload = JSON.parse(payload)

      if (parsedPayload.mode) {
        player.win.focus()
      } else {
        player.win.blur()
      }

      player.win.setIgnoreMouseEvents(!parsedPayload.mode)
      player.win.setAlwaysOnTop(true)
      if (MAC) player.win.setVisibleOnAllWorkspaces(true)
      player.win.setResizable(parsedPayload.mode)
      player.win.setMovable(parsedPayload.mode)
      if (MAC) player.win.setHasShadow(parsedPayload.mode)
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

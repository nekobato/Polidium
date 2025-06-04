"use strict"

const electron = require('electron')
const Sentry = require('@sentry/electron')
const { app, Tray, nativeImage, globalShortcut, ipcMain, Menu, dialog } = electron
const { autoUpdater } = require('electron-updater')
const os = require('os')
const DEBUG = process.env.DEBUG ? true : false
const MAC = os.type() === 'Darwin' ? true : false
const types = require('root/mutation-types')
const PlayerWindow = require('./player')
const ControllerWindow = require('./controller')

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN })
}

if (MAC) app.dock.hide()

app.on('ready', () => {

  var screen = electron.screen

  const menuTemplate = [
    {
      label: 'Polidium',
      submenu: [
        {
          label: 'Check for Updates...',
          click () {
            autoUpdater.checkForUpdates()
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Update ready',
      message: 'Update downloaded. Restart now?'
    }).then(result => {
      if (result.response === 0) autoUpdater.quitAndInstall()
    })
  })

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

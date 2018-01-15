'use strict'

import { app, Tray, nativeImage, ipcMain, globalShortcut } from 'electron'
import types from '../mutation-types'
import path from 'path'
import PlayerWindow from './player-window'
import ControllerWindow from './controller-window'
import env from './env'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (env.isDev) {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

if (env.isMac) app.dock.hide()

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (env.isMac) {
    app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

function createWindow () {
  var player = new PlayerWindow()
  var controller = new ControllerWindow()

  var trayIcon = nativeImage.createFromPath(path.join(__static, 'images/tray_icon.png'))
  var tray = new Tray(trayIcon)

  tray.on('click', (event, bounds) => {
    controller.toggle(bounds)
  })

  player.show()

  ipcMain.on(types.CONNECT_COMMIT, (event, typeName, payload) => {
    player.win.webContents.send(types.CONNECT_COMMIT, typeName, payload)
    controller.win.webContents.send(types.CONNECT_COMMIT, typeName, payload)

    if (typeName === types.QUIT) {
      app.quit()
    }

    const parsedPayload = JSON.parse(payload)

    if (typeName === types.SET_CLICKTHROUGH) {
      player.win.setIgnoreMouseEvents(parsedPayload.clickThrough)
      player.win.setAlwaysOnTop(parsedPayload.clickThrough)
      if (env.isMac) player.win.setVisibleOnAllWorkspaces(parsedPayload.clickThrough)
    }

    if (typeName === types.RESIZE_PLAYER) {
      if (parsedPayload.mode) {
        player.win.focus()
      } else {
        player.win.blur()
      }

      player.win.setIgnoreMouseEvents(!parsedPayload.mode)
      player.win.setAlwaysOnTop(true)
      if (env.isMac) player.win.setVisibleOnAllWorkspaces(true)
      player.win.setResizable(parsedPayload.mode)
      player.win.setMovable(parsedPayload.mode)
    }
  })
}

// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

'use strict'

import electron, { BrowserWindow } from 'electron'
import env from './env'

const config = require('./config')[env.isDev ? 'development' : 'production']

const winURL = env.isDev
  ? `http://localhost:9080`
  : `file://${__dirname}`

export default class {
  constructor () {
    let windowSize = env.isDev ? config.player.size : electron.screen.getPrimaryDisplay().workAreaSize

    if (env.isMac) {
      windowSize.height = windowSize.height - electron.screen.getMenuBarHeight()
    }

    this.win = new BrowserWindow({
      x: 0,
      y: 0,
      width: windowSize.width,
      height: windowSize.height,
      center: true,
      show: false,
      resizable: false,
      frame: false,
      transparent: true,
      skipTaskbar: true,
      alwaysOnTop: true,
      hasShadow: false
    })

    this.win.setIgnoreMouseEvents(true)
    this.win.setVisibleOnAllWorkspaces(true)

    this.win.loadURL(`${winURL}/#/player`)

    this.win.on('closed', () => {
      this.win = null
    })
  }

  show () {
    this.win.show()
  }
}

'use strict'

import { BrowserWindow } from 'electron'
import env from './env'

const winURL = env.isDev
  ? `http://localhost:9080`
  : `file://${__dirname}`

export default class {
  constructor () {
    // var size = electron.screen.getPrimaryDisplay().workAreaSize
    var size = { width: 400, height: 300 }

    this.win = new BrowserWindow({
      x: 0,
      y: 0,
      width: env.isDev ? 400 : size.width,
      height: env.isDev ? 300 : size.height - 24, // Macの上のトレイ分短く
      center: true,
      show: false,
      resizable: false,
      frame: false,
      transparent: true,
      skipTaskbar: true,
      alwaysOnTop: true
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

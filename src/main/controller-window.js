'use strict'

import electron, { BrowserWindow } from 'electron'
import env from './env'

const config = require('./config')[env.isDev ? 'development' : 'production']

const winURL = env.isDev
  ? `http://localhost:9080`
  : `file://${__dirname}`

export default class {
  constructor () {
    this.win = new BrowserWindow({
      width: config.controller.size.width,
      height: config.controller.size.height,
      show: false,
      resizable: false,
      frame: false,
      transparent: false,
      skipTaskbar: true,
      hasShadow: true
    })

    this.win.setVisibleOnAllWorkspaces(!env.isDev)

    this.win.on('blur', () => {
      if (!env.isDev) this.win.hide()
    })

    this.win.loadURL(`${winURL}/#/controller/file`)
  }

  showWindow (x) {
    this.win.setPosition(x - config.controller.size.width / 2, 40)
    this.win.show()
    this.win.focus()
  }

  toggle (bounds) {
    if (this.win.isVisible()) {
      this.win.hide()
    } else {
      this.showWindow(bounds.x)
    }
  }
}

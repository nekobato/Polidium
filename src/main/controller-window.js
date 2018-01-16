'use strict'

import electron, { BrowserWindow } from 'electron'
import env from './env'

const config = require('./config')[env.isDev ? 'development' : 'production']

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

    this.win.setVisibleOnAllWorkspaces(true)

    this.win.on('blur', () => {
      // controller doesn't hide in Dev
      if (!env.isDev) this.win.hide()
    })

    this.win.loadURL(`${config.winURL}#/controller/file`)
  }

  showWindow (bounds) {
    let display = electron.screen.getDisplayNearestPoint(bounds)

    this.win.setPosition(bounds.x - config.controller.size.width / 2, display.bounds.y + 40)
    this.win.show()
    this.win.focus()
  }

  toggle (bounds) {
    if (this.win.isVisible()) {
      // controller doesn't hide in Dev
      if (!env.isDev) this.win.hide()
    } else {
      this.showWindow(bounds)
    }
  }
}

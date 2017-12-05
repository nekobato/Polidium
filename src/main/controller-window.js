'use strict'

import { BrowserWindow } from 'electron'
import env from './env'

const WINDOW_WIDTH = 320

const winURL = env.isDev
  ? `http://localhost:9080`
  : `file://${__dirname}`

export default class {
  constructor () {
    this.win = new BrowserWindow({
      width: WINDOW_WIDTH,
      height: 310,
      show: env.isDev,
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
    this.win.setPosition(x - WINDOW_WIDTH / 2, 40)
    this.win.show()
    this.win.focus()
  }

  toggle (x) {
    if (this.win.isVisible()) {
      this.win.hide()
    } else {
      this.showWindow(x)
    }
  }
}

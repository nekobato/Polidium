"use strict"

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const DEBUG = process.env.DEBUG ? true : false

const WINDOW_WIDTH = 320

module.exports = class {

  constructor () {

    this.win = new BrowserWindow({
      width      : WINDOW_WIDTH,
      height     : 400,
      show       : DEBUG ? true : false,
      resizable  : DEBUG ? true : false,
      frame      : DEBUG ? true : false,
      transparent: DEBUG ? false : true,
      skipTaskbar: true,
      hasShadow  : true
    })

    this.win.setVisibleOnAllWorkspaces(DEBUG ? false : true)

    this.win.on('blur', () => {
      if (!DEBUG) this.win.hide()
    })

    this.win.loadURL('file://' + __dirname + '/controller.html')
  }

  showWindow (x) {
    this.win.setPosition(x - WINDOW_WIDTH/2, 0)
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

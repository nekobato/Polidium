"use strict"

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const WINDOW_WIDTH = 400

const DEBUG = process.env.DEBUG ? true : false

module.exports = class {

  constructor(options) {

    this.win = new BrowserWindow({
      width      : WINDOW_WIDTH,
      height     : 480,
      show       : false,
      resizable  : DEBUG ? true : false,
      frame      : DEBUG ? true : false,
      transparent: false,
      skipTaskbar: true,
      hasShadow  : true
    })

    this.win.setVisibleOnAllWorkspaces(true)

    this.win.on('blur', () => {
      if (!DEBUG) {
        this.win.hide()
      }
    })

    this.win.loadURL('file://' + __dirname + '/controller.html')
  }

  showWindow(x) {
    if (!DEBUG) {
      this.win.setPosition(x - WINDOW_WIDTH/2, 0)
    }
    this.win.show()
    this.win.focus()
  }

  toggle(x) {
    if (this.win.isVisible()) {
      this.win.hide()
    } else {
      this.showWindow(x)
    }
  }
}

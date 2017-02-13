"use strict"

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const DEBUG = process.env.DEBUG ? true : false

module.exports = class {

  constructor () {

    var electronScreen = electron.screen
    var size = electronScreen.getPrimaryDisplay().workAreaSize

    this.win = new BrowserWindow({
      x          : 0,
      y          : 0,
      width      : DEBUG ? 400 : size.width,
      height     : DEBUG ? 300 : size.height - 24, // Macの上のトレイ分短く
      center     : true,
      show       : false,
      resizable  : DEBUG ? true : false,
      frame      : DEBUG ? true : false,
      transparent: DEBUG ? false : true,
      skipTaskbar: true,
      alwaysOnTop: DEBUG ? false : true
    })

    this.win.setIgnoreMouseEvents(DEBUG ? false : true)
    this.win.setVisibleOnAllWorkspaces(DEBUG ? false : true)

    this.win.loadURL('file://' + __dirname + '/player.html')

    this.win.on('closed', () => {
      this.win = null
    })
  }

  show () {
    this.win.show()
  }
}

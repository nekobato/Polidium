const electron = require('electron')
const {BrowserWindow} = electron
const {ipcMain} = electron

const DEBUG = process.env.DEBUG ? true : false

module.exports = class {

  constructor() {

    var electronScreen = electron.screen
    var size = electronScreen.getPrimaryDisplay().workAreaSize

    this.win = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width,
      height: size.height - 24, // Macの上のトレイ分短く
      show: false,
      resizable: false,
      frame: false,
      transparent: DEBUG ? false : true,
      alwaysOnTop: DEBUG ? false : true,
      'skip-taskbar': true
    })

    this.win.center()
    this.win.setIgnoreMouseEvents(true)
    this.win.setVisibleOnAllWorkspaces(true)

    this.win.loadURL(`file://${__dirname}/player.html`)

    this.win.on('closed', () => {
      this.win = null
    })
  }

  show() {
    this.win.show()
  }
}

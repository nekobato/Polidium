import { BrowserWindow, screen } from 'electron'

const DEBUG = !!process.env.DEBUG

export default class PlayerWindow {
  win: BrowserWindow | null

  constructor () {
    const size = screen.getPrimaryDisplay().workAreaSize

    this.win = new BrowserWindow({
      x          : 0,
      y          : 0,
      width      : DEBUG ? 400 : size.width,
      height     : DEBUG ? 300 : size.height - 24, // Macの上のトレイ分短く
      center     : true,
      show       : false,
      resizable  : false,
      frame      : false,
      transparent: true,
      skipTaskbar: true,
      alwaysOnTop: true
    })

    this.win.setIgnoreMouseEvents(true)
    this.win.setVisibleOnAllWorkspaces(true)

    const devUrl = process.env.VITE_DEV_SERVER_URL
    if (devUrl) {
      this.win.loadURL(devUrl + '/player.html')
    } else {
      this.win.loadURL('file://' + __dirname + '/player.html')
    }

    this.win.on('closed', () => {
      this.win = null
    })
  }

  show () {
    this.win?.show()
  }
}

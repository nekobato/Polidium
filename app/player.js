"use strict"

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

module.exports = class {

  constructor() {

    var electronScreen = electron.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;

    this.win = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width,
      height: size.height - 24, // Macの上のトレイ分短く
      show: false,
      resizable: false,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      'skip-taskbar': true,
      'web-preferences': {
        'plugins': true
      }
    });

    this.win.center();
    this.win.setIgnoreMouseEvents(true);
    this.win.setVisibleOnAllWorkspaces(true);

    this.win.loadURL('file://' + __dirname + '/player.html');
  }

  show() {
    this.win.show();
  }
}

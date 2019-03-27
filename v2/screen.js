'use strict';

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;

const DEBUG = !!process.env.DEBUG;

module.exports = class {
  constructor() {
    var screen = electron.screen;
    var size = screen.getPrimaryDisplay().workAreaSize;

    this.win = new BrowserWindow({
      x: 0,
      y: 0,
      width: DEBUG ? 480 : size.width,
      height: DEBUG ? 320 : size.height - 24, // size of Mac tray size
      center: true,
      show: true,
      resizable: true
      // frame: true,
      // transparent: false,
      // skipTaskbar: false,
      // alwaysOnTop: false
    });

    // this.win.setIgnoreMouseEvents(true);
    // this.win.setVisibleOnAllWorkspaces(true);

    this.win.loadURL('http://localhost:8080');

    this.win.on('closed', () => {
      this.win = null;
    });
  }

  show() {
    this.win.show();
  }
};

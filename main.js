const electron = require('electron');
const app = electron.app;
const BrowserWindow = require('electron').BrowserWindow;

require('crash-reporter').start();

var win = null;

app.on('ready', function() {

  win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    resizable: false,
    frame: true,
    transparent: false,
    alwaysOnTop: true,
  });

  // win.setIgnoreMouseEvents(true);
  // win.setAlwaysOnTop(true);

  win.on('closed', function() {
    win = null;
  });

  win.loadURL('file://' + __dirname + '/index.html');
  win.show();

});

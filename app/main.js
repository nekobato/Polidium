const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const nativeImage = electron.nativeImage;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;

const DEBUG = process.env.DEBUG ? true : false

var win, tray;
var clickThru = true;

app.on('ready', function() {

  const Screen = require('screen');
  var size = Screen.getPrimaryDisplay().size;

  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height - 24,
    show: false,
    resizable: false,
    frame: false,
    transparent: true,
    alwaysOnTop: DEBUG ? false : true,
    'skip-taskbar': true
  });

  win.center();
  win.setIgnoreMouseEvents(clickThru);
  win.setVisibleOnAllWorkspaces(DEBUG ? false : true);

  win.on('closed', function() {
    win = null;
  });

  win.loadURL('file://' + __dirname + '/index.html');
  win.show();

  trayIcon = nativeImage.createFromPath(__dirname + '/tray_icon.png');
  tray = new Tray(trayIcon);

  tray.on('click', function(event, bounds) {
    toggleController();
  });

  var ret = globalShortcut.register('ctrl+P', function() {
    toggleController();
  });

  function toggleController() {
    clickThru = clickThru ? false : true;
    win.setIgnoreMouseEvents(clickThru);
    win.webContents.send('controller:toggle');
  }
});

app.on('login', function(event, webContents, request, authInfo, callback) {
  event.preventDefault();
  callback('pitecan', 'masu1lab');
})

app.on('will-quit', function() {
  globalShortcut.unregisterAll();
});

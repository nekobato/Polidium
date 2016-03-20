"use strict"

const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const nativeImage = electron.nativeImage;
const globalShortcut = electron.globalShortcut;
const ipcMain = electron.ipcMain;

const DEBUG = process.env.DEBUG ? true : false

const PlayerWindow = require('./player');
const ControllerWindow = require('./controller');

var tray, trayIcon, player, controller;

app.on('ready', function() {

  player = new PlayerWindow();
  controller = new ControllerWindow();

  trayIcon = nativeImage.createFromPath(__dirname + '/trayicon.png');
  tray = new Tray(trayIcon);

  tray.on('click', function(event, bounds) {
    controller.toggle(bounds.x);
  });

  player.show();

  ipcMain.on('controller:ipc-bridge', function(event, channel, data) {
    console.log(channel);
    player.win.webContents.send('main:ipc-bridge', channel, data);
  });

  ipcMain.on('controller:toggle-player', (event) => {
    var toggleTo = player.win.isAlwaysOnTop() ? false : true;
    player.win.setIgnoreMouseEvents(toggleTo);
    player.win.setAlwaysOnTop(toggleTo);
    player.win.setVisibleOnAllWorkspaces(toggleTo);
    player.win.webContents.send('main:toggle-player', toggleTo);
  });
});

app.on('login', function(event, webContents, request, authInfo, callback) {
  event.preventDefault();
  callback('', '');
})

app.on('will-quit', function() {
  globalShortcut.unregisterAll();
});

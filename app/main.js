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

  trayIcon = nativeImage.createFromPath(__dirname + '/tray_icon.png');
  tray = new Tray(trayIcon);

  tray.on('click', function(event, bounds) {
    controller.toggle(bounds.x);
  });

  player.show();

  ipcMain.on('controller:ipc-bridge', function(event, channel, fileStr) {
    console.log(channel);
    console.log(fileStr);
    player.win.webContents.send(channel, fileStr);
  });
});

app.on('login', function(event, webContents, request, authInfo, callback) {
  event.preventDefault();
  callback('pitecan', 'masu1lab');
})

app.on('will-quit', function() {
  globalShortcut.unregisterAll();
});

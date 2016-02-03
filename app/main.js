"use strict"

const electron = require('electron');
const app = electron.app;
const Tray = electron.Tray;
const nativeImage = electron.nativeImage;
const globalShortcut = electron.globalShortcut;

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
    controller.show(bounds.x);
  });

  player.show();
});

app.on('login', function(event, webContents, request, authInfo, callback) {
  event.preventDefault();
  callback('pitecan', 'masu1lab');
})

app.on('will-quit', function() {
  globalShortcut.unregisterAll();
});

var gui = require('nw.gui');
var win = gui.Window.get();
gui.Screen.Init();
var screens = gui.Screen.screens;
var CustomTrayMenu = require('./custom-tray');

var customTray;

process.on('log', function(msg) { console.log(msg); });

function init() {

  // win.width = screens[0].work_area.width;
  // win.height = screens[0].work_area.height;

  win.showDevTools();

  if (!customTray) {
    customTray = new CustomTrayMenu();
  }

  // gui.App.quit();
}

init();

var fs = require('fs');

files = fs.readdirSync('/Users/nekobato');

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#dir').innerText = files;
}, false );

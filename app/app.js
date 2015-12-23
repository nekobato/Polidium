var gui = require('nw.gui');
var win = gui.Window.get();
gui.Screen.Init();
var screens = gui.Screen.screens;

var tray, menu;

function init() {

  win.width = screens[0].work_area.width;
  win.height = screens[0].work_area.height;

  win.showDevTools();

  trayMenu = new gui.Menu();
  // https://github.com/nwjs/nw.js/wiki/MenuItem
  // https://github.com/nwjs/nw.js/wiki/Menu
  trayMenu.append(new gui.MenuItem({ label: 'Toggle Play <-> Stop' }));
  trayMenu.append(new gui.MenuItem({ label: 'Preferences' }));
  trayMenu.append(new gui.MenuItem({ type:  'separator' }));
  trayMenu.append(new gui.MenuItem({ label: 'Quit Polidium' }));

  tray = new gui.Tray({ icon: 'img/tray_icon.png' });
  tray.menu = trayMenu;
  process.emit('log', 'Add tray icon');

  tray.click = function() {
    process.emit('log', 'tray clicked');
  };

  // gui.App.quit();
}

init();

var gui = require('nw.gui');
var win = gui.Window.get();
gui.Screen.Init();
var screens = gui.Screen.screens;

win.width = screens[0].work_area.width;
win.height = screens[0].work_area.height;

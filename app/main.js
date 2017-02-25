module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict"

	const { app, Tray, nativeImage, globalShortcut, ipcMain } = __webpack_require__(1)

	const DEBUG = process.env.DEBUG ? true : false
	const types = __webpack_require__(2)
	const PlayerWindow = __webpack_require__(3)
	const ControllerWindow = __webpack_require__(4)

	if (!DEBUG) app.dock.hide()

	app.on('ready', () => {

	  var player = new PlayerWindow()
	  var controller = new ControllerWindow()

	  var trayIcon = nativeImage.createFromPath(__dirname + '/img/tray_icon.png')
	  var tray = new Tray(trayIcon)

	  tray.on('click', (event, bounds) => {
	    controller.toggle(bounds.x)
	  })

	  player.show()

	  ipcMain.on(types.CONNECT_STATE, (event) => {
	    console.log('[background] vuex-connect', winId)
	    event.returnValue = store.state
	  })

	  ipcMain.on(types.CONNECT_COMMIT, (event, typeName, payload) => {
	    console.log(typeName, payload)
	    player.win.webContents.send(types.CONNECT_COMMIT, typeName, payload)
	    controller.win.webContents.send(types.CONNECT_COMMIT, typeName, payload)

	    if (typeName === types.QUIT) app.quit()

	    if (typeName === types.CHANGE_THROUGTH) {
	      player.win.setIgnoreMouseEvents(payload.toggle)
	      player.win.setAlwaysOnTop(payload.toggle)
	    }
	  })
	})

	app.on('will-quit', () => {
	  globalShortcut.unregisterAll()
	})

	app.on('window-all-closed', () => {
	  if (process.platform !== 'darwin') {
	    app.quit()
	  }
	})


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("electron");

/***/ },
/* 2 */
/***/ function(module, exports) {

	exports.CONNECT_STATE = 'CONNECT_STATE'
	exports.CONNECT_COMMIT = 'CONNECT_COMMIT'

	exports.DROP_FILE = 'DROP_FILE'

	exports.PLAY_FILE = 'PLAY_FILE'
	exports.PAUSE_FILE = 'PAUSE_FILE'
	exports.RESUME_FILE = 'RESUME_FILE'
	exports.REMOVE_QUEUE = 'REMOVE_QUEUE'
	exports.REMOVE_QUEUES = 'REMOVE_QUEUES'
	exports.VIDEO_TIMEUPDATE = 'VIDEO_TIMEUPDATE'
	exports.VIDEO_CANPLAY = 'VIDEO_CANPLAY'
	exports.VIDEO_SEEK = 'VIDEO_SEEK'
	exports.VIDEO_PLAYED = 'VIDEO_PLAYED'
	exports.VIDEO_PAUSED = 'VIDEO_PAUSED'

	exports.CHANGE_LAYOUT = 'CHANGE_LAYOUT'
	exports.CHANGE_MODE = 'CHANGE_MODE'
	exports.CHANGE_OPACITY = 'CHANGE_OPACITY'
	exports.CHANGE_THROUGTH = 'CHANGE_THROUGTH'
	exports.RESIZE_PLAYER_MODE = 'RESIZE_PLAYER_MODE'

	exports.OPEN_URL = 'OPEN_URL'

	exports.RELOAD = 'RELOAD'
	exports.QUIT = 'QUIT'


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict"

	const electron = __webpack_require__(1)
	const BrowserWindow = electron.BrowserWindow

	const DEBUG = process.env.DEBUG ? true : false

	module.exports = class {

	  constructor () {

	    var electronScreen = electron.screen
	    var size = electronScreen.getPrimaryDisplay().workAreaSize

	    this.win = new BrowserWindow({
	      x          : 0,
	      y          : 0,
	      width      : DEBUG ? 400 : size.width,
	      height     : DEBUG ? 300 : size.height - 24, // Macの上のトレイ分短く
	      center     : true,
	      show       : false,
	      resizable  : DEBUG ? true : false,
	      frame      : DEBUG ? true : false,
	      transparent: DEBUG ? false : true,
	      skipTaskbar: true,
	      alwaysOnTop: DEBUG ? false : true
	    })

	    this.win.setIgnoreMouseEvents(DEBUG ? false : true)
	    this.win.setVisibleOnAllWorkspaces(DEBUG ? false : true)

	    this.win.loadURL('file://' + __dirname + '/player.html')

	    this.win.on('closed', () => {
	      this.win = null
	    })
	  }

	  show () {
	    this.win.show()
	  }
	}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict"

	const electron = __webpack_require__(1)
	const BrowserWindow = electron.BrowserWindow

	const DEBUG = process.env.DEBUG ? true : false

	const WINDOW_WIDTH = 320

	module.exports = class {

	  constructor () {

	    this.win = new BrowserWindow({
	      width      : WINDOW_WIDTH,
	      height     : 400,
	      show       : DEBUG ? true : false,
	      resizable  : DEBUG ? true : false,
	      frame      : DEBUG ? true : false,
	      transparent: DEBUG ? false : true,
	      skipTaskbar: true,
	      hasShadow  : true
	    })

	    this.win.setVisibleOnAllWorkspaces(DEBUG ? false : true)

	    this.win.on('blur', () => {
	      if (!DEBUG) this.win.hide()
	    })

	    this.win.loadURL('file://' + __dirname + '/controller.html')
	  }

	  showWindow (x) {
	    this.win.setPosition(x - WINDOW_WIDTH/2, 0)
	    this.win.show()
	    this.win.focus()
	  }

	  toggle (x) {
	    if (this.win.isVisible()) {
	      this.win.hide()
	    } else {
	      this.showWindow(x)
	    }
	  }
	}


/***/ }
/******/ ]);
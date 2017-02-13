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

	const PlayerWindow = __webpack_require__(2)
	const ControllerWindow = __webpack_require__(3)

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

	  ipcMain.on('EXIT', (event) => {
	    app.quit()
	  })

	  ipcMain.on('CHANGE_THROUGTH', (event, toggle) => {
	    player.win.setIgnoreMouseEvents(toggle)
	    player.win.setAlwaysOnTop(toggle)
	    player.win.setVisibleOnAllWorkspaces(toggle)
	    player.win.webContents.send('CHANGE_THROUGTH', toggle)
	  })

	  __webpack_require__(4)

	  Vue.use(Vuex)

	  const store = new Vuex.Store({
	    state: {
	      mode: 'FilePlayer',
	      settings: {
	        display: 1,
	        x: 0,
	        y: 0,
	        width: '100%',
	        height: '100%',
	        mode: 'file',
	        opacity: 0.1,
	        through: true
	      }
	    },
	    middlewares: [{
	      onMutation (mutation, state) {
	        // player.win.webContents.send('CONNECT_COMMIT', type, mutation)
	        // controller.win.webContents.send('CONNECT_COMMIT', type, mutation)
	      }
	    }]
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
/* 3 */
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const { ipcMain } = __webpack_require__(1)
	const Vue = __webpack_require__(5)
	const Vuex = __webpack_require__(6)
	const types = __webpack_require__(7)
	const fileModule = __webpack_require__(8)

	Vue.use(Vuex)

	const DEBUG = ("production") !== 'production'

	Vue.config.debug = DEBUG ? true : false

	module.exports = new Vuex.Store({
	  state: {
	    modules: {
	      file: fileModule
	    },
	    // player: ipcRenderer.sendSync(types.CONNECT_STATE),
	    file: {
	      queues: []
	    },
	    settings: {
	      opacity: 0.05,
	      clickThrough: true,
	      displays: [1,2,3]
	    },
	    video: {
	      src: '',
	      controls: false
	    },
	    web: {
	      src: ''
	    }
	  },
	  mutations: {
	    [types.DROP_FILE] (state, files) {
	      for (file of files) {
	        if (file.type === 'video/mp4') {
	          state.file.queues.push(file)
	        }
	      }
	    },
	    [types.PLAY_FILE] (state, index) {
	      // ipcRenderer.send('CONNECT_COMMIT', types.PLAY_FILE, JSON.stringify(state.file.queues[index].path))
	    }
	  },
	  strict: DEBUG
	})

	ipcMain.on('CONNECT_STATE', (event) => {
	  let winId = BrowserWindow.fromWebContents(event.sender).id
	  console.log('[background] vuex-connect', winId)

	  clients[winId] = event.sender
	  event.returnValue = store.state
	})

	ipcMain.on('CONENCT_COMMIT', (event, type, payload) => {
	  // store.commit(type, payload)
	  player.win.webContents.send('COMMIT', type, payload)
	  controller.win.webContents.send('COMMIT', type, payload)
	})


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("vue");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("vuex");

/***/ },
/* 7 */
/***/ function(module, exports) {

	exports.COMMIT = 'COMMIT'

	exports.DROP_FILE = 'DROP_FILE'

	exports.PLAY_FILE = 'PLAY_FILE'
	exports.WAIT_FILE = 'WAIT_FILE'
	exports.REMOVE_QUEUE = 'REMOVE_QUEUE'
	exports.REMOVE_QUEUES = 'REMOVE_QUEUES'

	exports.CONNECT_STATE = 'CONNECT_STATE'
	exports.CONNECT_COMMIT = 'CONNECT_COMMIT'

	exports.CHANGE_LAYOUT = 'CHANGE_LAYOUT'
	exports.CHANGE_MODE = 'CHANGE_MODE'
	exports.CHANGE_OPACITY = 'CHANGE_OPACITY'
	exports.CHANGE_THROUGTH = 'CHANGE_THROUGTH'
	exports.RESIZE_PLAYER_MODE = 'RESIZE_PLAYER_MODE'

	exports.OPEN_URL = 'OPEN_URL'

	exports.EXIT = 'EXIT'


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const types = __webpack_require__(7)
	const ipcRenderer = __webpack_require__(1).ipcRenderer

	module.exports = {
	  mutations: {  },
	  actions: {
	    [types.PLAY_FILE] (index) {
	      ipcRenderer.send(types.COMMIT, types.PLAY_FILE, { index: index })
	    }
	  }
	}


/***/ }
/******/ ]);
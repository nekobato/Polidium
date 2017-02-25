const { BrowserWindow, ipcMain } = require('electron')
const types = require('root/mutation-types')

const DEBUG = process.env.NODE_ENV !== 'production'

const clients = []

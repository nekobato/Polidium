const electron = require('electron')
const ipcRenderer = electron.ipcRenderer
const remote      = electron.remote
const fs = remote.require('fs')
const path = remote.require('path')
import styleSheet from './style.styl'

export default {
  template: require('./template.jade')(),
  data() {
    return {
      styles: styleSheet
    }
  },
  events: {
  },
  methods: {
  }
}

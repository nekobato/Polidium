const renderer = require('electron').ipcRenderer

import Vue from 'vue'

import materializeCss from 'materialize-css/dist/css/materialize.min.css'
import materialIcons from 'material-design-icons/iconfont/material-icons.css'

import Controller from './components/Controller.vue'

new Vue(Controller)

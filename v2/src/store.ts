import Vue from 'vue';
import * as Vuex from 'vuex';
import { mode, controllerViews } from './values';
const { ipcRenderer } = require('electron-ipc-mock')();
process.env.NODE_ENV === 'browser'
  ? require('electron-ipc-mock')()
  : require('electron');

Vue.use(Vuex);

const settings = localStorage.Settings
  ? JSON.parse(localStorage.Settings)
  : {
      opacity: 100,
      hideOnLauncher: false
    };

const Store = new Vuex.Store({
  state: {
    settings,
    window: {
      onMouse: false
    },
    mode: mode.video,
    controllerView: controllerViews.none,
    video: {
      source: ''
    },
    web: {
      url: ''
    }
  },
  mutations: {
    onMouseEnter(store) {
      store.window.onMouse = true;
    },
    onMouseLeave(store) {
      store.window.onMouse = false;
    },
    changeModeToVideo(store) {
      store.mode = mode.video;
    },
    changeModeToWeb(store) {
      store.mode = mode.web;
    },
    openSettings(store) {
      store.controllerView = controllerViews.settings;
    },
    closeSettings(store) {
      store.controllerView = controllerViews.none;
    },
    changeOpacity(store, payload) {
      store.settings.opacity = payload.opacity;
      ipcRenderer.send('changeOpacity', payload);
    },
    hideOnLauncher(store, payload) {
      store.settings.hideOnLauncher = payload.hideOnLauncher;
      ipcRenderer.send('hideOnLauncher', payload);
    }
  },
  actions: {}
});

export default Store;

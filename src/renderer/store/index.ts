import Vue from 'vue';
import * as Vuex from 'vuex';
import * as types from '../../shared/mutation-types';
import { mode } from '../values';
import state from './state';
const { ipcRenderer } =
  process.env.NODE_ENV === 'browser'
    ? window.require('electron-ipc-mock')()
    : window.require('electron');

Vue.use(Vuex);

function ipcSend(event: string, payload: any): void {
  ipcRenderer.send(event, JSON.stringify(payload));
}

ipcRenderer.on('SET_OPACITY', (_: any, payload: string) => {
  console.log('set opacity');
  Store.commit('changeOpacity', { value: parseInt(payload, 10) });
});

// Hide On Taskbar
ipcRenderer.on(types.SET_HIDE_ON_TASKBAR, (_: any, toggle: string) => {
  console.log(types.SET_HIDE_ON_TASKBAR);
  window.localStorage.setItem('Settings.hideOnTaskBar', toggle);
});

const hideOnTaskBar = localStorage.getItem('Settings.hideOnTaskBar');

if (hideOnTaskBar === 'false') {
  ipcRenderer.send(types.SET_HIDE_ON_TASKBAR, hideOnTaskBar);
}

const Store = new Vuex.Store({
  state,
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
    changeOpacity(store, { value }) {
      console.log('change', value);
      store.settings.opacity = value;
      ipcSend('SET_OPACITY', { value });
    },
    hideOnLauncher(store, payload) {
      store.settings.hideOnLauncher = payload.value;
      ipcSend('hideOnLauncher', payload);
    },
    webSubmitUrl(store, { url }) {
      store.web.url = url;
    },
    webAction(store, { action }) {
      store.web.action = action;
    },
    endWebAction(store) {
      store.web.action = '';
    },
    seekMedia(store, parcentage) {
      store.video.media.currentTime = store.video.media.duration * parcentage;
      console.log(parcentage);
    },
    [types.VIDEO_LIST_TOGGLE](store, flag) {
      store.video.fileList.isVisible = flag;
    },
  },
});

export default Store;

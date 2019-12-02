import Vue from 'vue';
import * as Vuex from 'vuex';
import * as types from '../mutation-types';
import { mode } from '../values';
import state from './state';
const { ipcRenderer } = process.env.IS_ELECTRON
  ? require('electron')
  : { ipcRenderer: { on: () => {}, send: () => {} } };

Vue.use(Vuex);

function ipcSend(event: string, payload: any): void {
  ipcRenderer.send(event, JSON.stringify(payload));
}

ipcRenderer.on('SET_OPACITY', (_: any, payload: string) => {
  console.log('set opacity');
  Store.commit('changeOpacity', { value: parseInt(payload, 10) });
});

ipcRenderer.on('SET_URL', (_: any, payload: string) => {
  console.log('set URL', payload);
  Store.commit(types.SET_URL, payload);
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
    changeOpacity(store, { value }) {
      console.log('change', value);
      store.settings.opacity = value;
      ipcSend(types.SET_OPACITY, { value });
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
    [types.SET_MODE](store, modeName: 'web' | 'video') {
      ipcSend(types.SET_MODE, { value: modeName });
      store.mode = mode[modeName];
    },
    [types.VIDEO_LIST_TOGGLE](store, flag) {
      store.video.fileList.isVisible = flag;
    },
    [types.VIDEO_LIST_ADD_FILES](store, files) {
      store.video.fileList.data = store.video.fileList.data.concat(files);
    },
    [types.VIDEO_SELECT_FILE](store, index) {
      store.video.source = store.video.fileList.data[index];
      console.log(store.video.source);
    },
    [types.BROWSER_VIEW_EVENT](store, data) {
      ipcSend(types.BROWSER_VIEW_EVENT, data);
    },
    [types.SET_URL](store, { url, canGoBack, canGoForward }) {
      store.web.url = url;
      store.web.canGoBack = canGoBack;
      store.web.canGoForward = canGoForward;
    },
    [types.BROWSER_CAN_GO_BACK](store) {
      store.web.canGoBack = true;
    },
    [types.BROWSER_CAN_GO_FORWARD](store) {
      store.web.canGoForward = true;
    },
  },
});

export default Store;

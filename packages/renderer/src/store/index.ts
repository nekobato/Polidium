import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import * as types from '../../../mutation-types';
import { mode } from '../values';
import state, { State } from './state';
import { ipcRenderer } from 'electron';

function ipcSend(event: string, payload: any): void {
  ipcRenderer.send(event, JSON.stringify(payload));
}

ipcRenderer.on('SET_OPACITY', (_: any, payload: string) => {
  store.commit('changeOpacity', { value: parseInt(payload, 10) });
});

ipcRenderer.on('SET_URL', (_: any, payload: string) => {
  store.commit(types.SET_URL, payload);
});

ipcRenderer.on(types.BROWSER_CAN_GO_BACK, (_: any, payload: string) => {
  console.log('Browser can go back status', payload);
  store.commit(types.BROWSER_CAN_GO_BACK, payload);
});

ipcRenderer.on(types.BROWSER_CAN_GO_FORWARD, (_: any, payload: string) => {
  console.log('Browser can go forward status', payload);
  store.commit(types.BROWSER_CAN_GO_FORWARD, payload);
});

// Hide On Taskbar
ipcRenderer.on(types.SET_HIDE_ON_TASKBAR, (_: any, toggle: string) => {
  window.localStorage.setItem('Settings.hideOnTaskBar', toggle);
});

const hideOnTaskBar = localStorage.getItem('Settings.hideOnTaskBar');

if (hideOnTaskBar === 'false') {
  ipcRenderer.send(types.SET_HIDE_ON_TASKBAR, hideOnTaskBar);
}

const store = createStore({
  state,
  mutations: {
    onMouseEnter(store) {
      store.window.onMouse = true;
    },
    onMouseLeave(store) {
      store.window.onMouse = false;
    },
    changeOpacity(store, { value }) {
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
    },
    [types.SET_MODE](store, modeName: 'web' | 'video') {
      console.log(types.SET_MODE);
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
    },
    [types.BROWSER_VIEW_EVENT](store, data) {
      ipcSend(types.BROWSER_VIEW_EVENT, data);
    },
    [types.SET_URL](store, { url, canGoBack, canGoForward }) {
      console.log(types.SET_URL, { url, canGoBack, canGoForward });
      store.web.url = url;
      store.web.canGoBack = canGoBack;
      store.web.canGoForward = canGoForward;
    },
    [types.BROWSER_CAN_GO_BACK](store, payload) {
      store.web.canGoBack = payload.status;
    },
    [types.BROWSER_CAN_GO_FORWARD](store, payload) {
      store.web.canGoForward = payload.status;
    },
  },
});

export const key: InjectionKey<Store<State>> = Symbol();

export function useStore() {
  return baseUseStore(key);
}

export default store;

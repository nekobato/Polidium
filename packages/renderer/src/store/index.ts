import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import * as types from '../../../mutation-types';
import { mode } from '../values';
import state, { State } from './state';

// for Browser debug
if (!window.ipc) {
  window.ipc = {
    send: () => {},
    on: () => {},
  };
}

function ipcSend(event: string, payload?: any): void {
  window.ipc.send(event, payload);
}

window.ipc.on('SET_OPACITY', (_: any, payload: string) => {
  store.commit('changeOpacity', { value: parseInt(payload, 10) });
});

window.ipc.on(types.TOGGLE_RESIZE, (_: any, payload: string) => {
  console.log('TOGGLE_RESIZE', payload);
  if (store.state.resizing) {
    if (store.state.mode === 'web') {
      ipcSend(types.CLOSE_WEBVIEW);
    }
    store.commit(types.END_RESIZE);
  } else {
    if (store.state.mode === 'web') {
      ipcSend(types.OPEN_WEBVIEW);
    }
    store.commit(types.START_RESIZE);
  }
});

window.ipc.on('SET_URL', (_: any, payload: string) => {
  store.commit(types.SET_URL, payload);
});

window.ipc.on(types.BROWSER_CAN_GO_BACK, (_: any, payload: string) => {
  console.log('Browser can go back status', payload);
  store.commit(types.BROWSER_CAN_GO_BACK, payload);
});

window.ipc.on(types.BROWSER_CAN_GO_FORWARD, (_: any, payload: string) => {
  console.log('Browser can go forward status', payload);
  store.commit(types.BROWSER_CAN_GO_FORWARD, payload);
});

// Hide On Taskbar
window.ipc.on(types.SET_HIDE_ON_TASKBAR, (_: any, toggle: string) => {
  window.localStorage.setItem('Settings.hideOnTaskBar', toggle);
});

const hideOnTaskBar = localStorage.getItem('Settings.hideOnTaskBar');

if (hideOnTaskBar === 'false') {
  window.ipc.send(types.SET_HIDE_ON_TASKBAR, hideOnTaskBar);
}

const store = createStore({
  state,
  mutations: {
    onMouseEnter(state) {
      state.window.onMouse = true;
    },
    onMouseLeave(state) {
      state.window.onMouse = false;
    },
    changeOpacity(state, { value }) {
      state.settings.opacity = value;
      ipcSend(types.SET_OPACITY, { value });
    },
    hideOnLauncher(state, payload) {
      state.settings.hideOnLauncher = payload.value;
      ipcSend('hideOnLauncher', payload);
    },
    webSubmitUrl(state, { url }) {
      state.web.url = url;
    },
    webAction(state, { action }) {
      state.web.action = action;
    },
    endWebAction(state) {
      state.web.action = '';
    },
    seekMedia(state, parcentage) {
      state.video.media.currentTime = state.video.media.duration * parcentage;
    },
    [types.TOGGLE_SETTINGS](state) {
      state.settingsView = !state.settingsView;
    },
    [types.SET_FULLSCREEN]() {
      ipcSend(types.SET_FULLSCREEN);
    },
    [types.TOGGLE_RESIZE]() {
      ipcSend(types.TOGGLE_RESIZE);
    },
    [types.START_RESIZE](state) {
      state.resizing = true;
    },
    [types.END_RESIZE]() {
      state.resizing = false;
    },
    [types.SET_MODE](state, modeName: 'web' | 'video') {
      ipcSend(types.SET_MODE, { value: modeName });
      state.mode = mode[modeName];
    },
    [types.VIDEO_PLAY](state) {
      state.video.media.isPlaying = true;

      window.ipc.send(types.VIDEO_VIEW_EVENT, {
        action: types.VIDEO_PLAY,
      });
    },
    [types.VIDEO_PAUSE](state) {
      state.video.media.isPlaying = false;

      window.ipc.send(types.VIDEO_VIEW_EVENT, {
        action: types.VIDEO_PAUSE,
      });
    },
    [types.VIDEO_SELECT](_, payload) {
      console.log(payload);
      window.ipc.send(types.VIDEO_VIEW_EVENT, {
        action: types.VIDEO_SELECT,
        payload: {
          name: payload.name,
          path: payload.path,
        },
      });
    },
    // [types.VIDEO_LIST_TOGGLE](state, flag) {
    //   state.video.fileList.isVisible = flag;
    // },
    [types.VIDEO_LIST_ADD_FILES](state, files) {
      state.video.fileList.push(...files);
    },
    [types.SET_VIDEO_SOURCE](state, file: any) {
      state.video.source = file;
    },
    [types.BROWSER_VIEW_EVENT](state, data) {
      ipcSend(types.BROWSER_VIEW_EVENT, data);
    },
    [types.SET_URL](state, { url, canGoBack, canGoForward }) {
      state.web.url = url;
      state.web.canGoBack = canGoBack;
      state.web.canGoForward = canGoForward;
    },
    [types.BROWSER_CAN_GO_BACK](state, payload) {
      state.web.canGoBack = payload.status;
    },
    [types.BROWSER_CAN_GO_FORWARD](state, payload) {
      state.web.canGoForward = payload.status;
    },
  },
});

export const key: InjectionKey<Store<State>> = Symbol();

export function useStore() {
  return baseUseStore(key);
}

export default store;

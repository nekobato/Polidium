import Vue from 'vue';
import * as Vuex from 'vuex';
import * as types from '../shared/mutation-types';
import { mode } from './values';
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

ipcRenderer.on(types.SET_HIDE_ON_TASKBAR, (_: any, toggle: string) => {
  console.log(types.SET_HIDE_ON_TASKBAR);
  window.localStorage.setItem('hideOnTaskBar', toggle);
});

const hideOnTaskBar = localStorage.getItem('hideOnTaskBar');

if (hideOnTaskBar === 'false') {
  ipcRenderer.send(types.SET_HIDE_ON_TASKBAR, hideOnTaskBar);
}

export type State = {
  settings: {
    opacity: number;
    hideOnLauncher: boolean;
  };
  window: {
    onMouse: boolean;
  };
  mode: string;
  video: {
    source: string;
    media: {
      index: number;
      duration: number;
      currentTime: number;
    };
    fileList: any[];
  };
  web: {
    url: string;
    action: string;
    histories: any[];
  };
  views: {
    window: boolean;
    controller: string;
  };
};

const state: State = {
  settings: localStorage.Settings
    ? JSON.parse(localStorage.Settings)
    : {
        opacity: 100,
        hideOnLauncher: false,
      },
  window: {
    onMouse: false,
  },
  mode: mode.video,
  video: {
    source: '',
    media: {
      index: 0,
      duration: 0,
      currentTime: 0,
    },
    fileList: [],
  },
  web: {
    url: 'https://google.com',
    action: '',
    histories: [],
  },
  views: {
    window: false,
    controller: '',
  },
};

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
  },
});

export default Store;

import Vue from "vue";
import * as Vuex from "vuex";
import { mode, controllerViews } from "./values";
const { ipcRenderer } =
  process.env.NODE_ENV === "browser"
    ? window.require("electron-ipc-mock")()
    : window.require("electron");

Vue.use(Vuex);

function ipcSend(event: string, payload: any): void {
  ipcRenderer.send(event, JSON.stringify(payload));
}

const state = {
  settings: localStorage.Settings
    ? JSON.parse(localStorage.Settings)
    : {
        opacity: 100,
        hideOnLauncher: false
      },
  window: {
    onMouse: false
  },
  mode: mode.web,
  controllerView: controllerViews.none,
  video: {
    source: ""
  },
  web: {
    url: "https://google.com",
    action: ""
  },
  views: {
    window: false,
    controller: ""
  }
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
    toggleController(store) {
      store.controllerView = store.mode;
    },
    openSettings(store) {
      store.controllerView = controllerViews.settings;
    },
    closeSettings(store) {
      store.controllerView = controllerViews.none;
    },
    changeOpacity(store, { value }) {
      store.settings.opacity = value;
      ipcSend("SET_OPACITY", { value });
    },
    hideOnLauncher(store, payload) {
      store.settings.hideOnLauncher = payload.value;
      ipcSend("hideOnLauncher", payload);
    },
    webSubmitUrl(store, { url }) {
      store.web.url = url;
    },
    webAction(store, { action }) {
      store.web.action = action;
    },
    endWebAction(store) {
      store.web.action = "";
    }
  },
});

export default Store;

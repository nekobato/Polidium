import Vue from "vue";
import * as Vuex from "vuex";
import { mode, controllerViews } from "./values";
const { ipcRenderer } =
  process.env.NODE_ENV === "browser"
    ? require("electron-ipc-mock")()
    : require("electron");

Vue.use(Vuex);

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
  mode: mode.video,
  controllerView: controllerViews.none,
  video: {
    source: ""
  },
  web: {
    url: "",
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
    changeOpacity(store, payload) {
      store.settings.opacity = payload.opacity;
      ipcRenderer.send("changeOpacity", payload);
    },
    hideOnLauncher(store, payload) {
      store.settings.hideOnLauncher = payload.hideOnLauncher;
      ipcRenderer.send("hideOnLauncher", payload);
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
  actions: {
    webDoRefresh() {},
    webGotoPrev() {},
    webGotoNext() {},
    changeOpacity(value) {
      ipcRenderer.send("changeOpacity", {
        opacity: value
      });
    },
    changeHiding(value) {
      ipcRenderer.send("changeHiding", {
        value
      });
    }
  }
});

export default Store;

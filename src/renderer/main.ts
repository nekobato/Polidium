import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import { pinia } from "./store";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import Player from "./Player/Player.vue";
import VideoPlayer from "./Player/VideoPlayer.vue";
import WebPlayer from "./Player/WebPlayer.vue";
import Controller from "./Controller/Controller.vue";
import FileController from "./Controller/FileController.vue";
import WebController from "./Controller/WebController.vue";
import Settings from "./Controller/Settings.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/player",
      component: Player,
      children: [
        { path: "", redirect: "/player/file" },
        { path: "file", component: VideoPlayer },
        { path: "web", component: WebPlayer }
      ]
    },
    {
      path: "/controller",
      component: Controller,
      children: [
        { path: "", redirect: "/controller/file" },
        { path: "file", component: FileController },
        { path: "web", component: WebController },
        { path: "settings", component: Settings }
      ]
    }
  ]
});

const app = createApp(App).use(router).use(pinia).use(ElementPlus);

// Hash mode handles this automatically, no manual hash handling needed

app.mount("#app");

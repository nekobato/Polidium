import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import { pinia } from "./store";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Player from "./Player/Player.vue";
import Controller from "./Controller/Controller.vue";
import FileController from "./Controller/FileController.vue";
import WebController from "./Controller/WebController.vue";
import Settings from "./Controller/Settings.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/player", component: Player },
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

const app = createApp(App).use(pinia).use(ElementPlus).use(router);

// Support '#player' and '#controller' hash navigation including child paths
const hash = window.location.hash.replace("#", "");
if (hash === "player" || hash.startsWith("controller")) {
  router.replace("/" + hash);
}

app.mount("#app");

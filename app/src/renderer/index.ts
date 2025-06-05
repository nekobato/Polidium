import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { pinia } from "./store";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import Player from "./Player/Player.vue";
import Controller from "./Controller/Controller.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/player", component: Player },
    { path: "/controller", component: Controller }
  ]
});

const app = createApp(App).use(pinia).use(ElementPlus).use(router);

// Support '#player' and '#controller' hash navigation
const hash = window.location.hash.replace("#", "");
if (hash === "player" || hash === "controller") {
  router.replace("/" + hash);
}

app.mount("#app");

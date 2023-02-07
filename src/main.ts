import { createApp } from "vue";
import VueRouter from "vue-router";
import "./style.css";
import App from "./App.vue";
import "./samples/node-api";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: "/viewer",
      component: () => import("./pages/viewer/index.vue"),
    },
    {
      path: "/viewer/browser",
      component: () => import("./pages/viewer/browser.vue"),
    },
    {
      path: "/viewer/video",
      component: () => import("./pages/viewer/video.vue"),
    },
    {
      path: "/viewer/resize",
      component: () => import("./pages/viewer/resize.vue"),
    },
    {
      path: "/controller",
      component: () => import("./pages/controller/index.vue"),
    },
    {
      path: "/controller/file",
      component: () => import("./pages/controller/file.vue"),
    },
    {
      path: "/controller/web",
      component: () => import("./pages/controller/web.vue"),
    },
    {
      path: "/controller/settings",
      component: () => import("./pages/controller/settings.vue"),
    },
  ],
});

createApp(App)
  .use(router)
  .mount("#app")
  .$nextTick(() => {
    postMessage({ payload: "removeLoading" }, "*");
  });

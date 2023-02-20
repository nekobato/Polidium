import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import './style.css';
import App from './App.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/viewer',
      component: () => import('./pages/viewer/index.vue'),
    },
    {
      path: '/viewer/web',
      component: () => import('./pages/viewer/web.vue'),
    },
    {
      path: '/viewer/video',
      component: () => import('./pages/viewer/video.vue'),
    },
    {
      path: '/viewer/resize',
      component: () => import('./pages/viewer/resize.vue'),
    },
    {
      path: '/controller',
      component: () => import('./pages/controller/index.vue'),
    },
  ],
});

createApp(App).use(router).mount('#app').$nextTick(window.removeLoading);

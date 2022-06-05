import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Monitor from '@/views/Monitor.vue';
import Controller from '@/views/Controller.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/monitor',
    name: 'monitor',
    component: Monitor,
  },
  {
    path: '/controller',
    name: 'controller',
    component: Controller,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

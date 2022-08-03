import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Monitor from '@/views/Monitor.vue';
import Controller from '@/views/Controller.vue';
import Web from '@/components/Monitors/Web.vue';
import Video from '@/views/Monitor/Video.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/monitor',
    name: 'monitor',
    component: Monitor,
    children: [
      { path: 'web', component: Web },
      { path: 'video', component: Video },
    ],
  },
  {
    path: '/controller',
    name: 'controller',
    component: Controller,
  },
];

const router = createRouter({
  history: createWebHashHistory('./'),
  routes,
});

export default router;

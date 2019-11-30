import Vue from 'vue';
import VueRouter from 'vue-router';
import Monitor from '@/views/Monitor.vue';
import Controller from '@/views/Controller.vue';

Vue.use(VueRouter);

const routes = [
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

const router = new VueRouter({
  routes,
});

export default router;

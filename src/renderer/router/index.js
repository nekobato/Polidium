import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/controller',
      name: 'controller',
      component: require('@/components/Controller').default,
      children: [{
        path: 'file',
        component: require('@/components/Controller/FileController').default
      },
      {
        path: 'web',
        component: require('@/components/Controller/WebController').default
      },
      {
        path: 'settings',
        component: require('@/components/Controller/Settings').default
      }]
    },
    {
      path: '/player',
      name: 'Player',
      component: require('@/components/Player').default
    }

  ]
})

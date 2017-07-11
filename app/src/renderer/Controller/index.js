import Vue from 'vue'
import store from '../store'
import Controller from './Controller.vue'

import materializeCss from 'materialize-css/dist/css/materialize.min.css'
import materialIcons from 'material-design-icons/iconfont/material-icons.css'

new Vue({
  el: '#controller',
  store,
  render: h => h(Controller)
})

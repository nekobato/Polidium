import Vue from 'vue'
import store from '../store'
import Player from './Player.vue'

import materialIcons from 'material-design-icons/iconfont/material-icons.css'

new Vue({
  el: '#player',
  store,
  render: h => h(Player)
})

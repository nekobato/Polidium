const Vue = require('vue')
const store = require('../store')
const Player = require('./Player.vue')

const materialIcons = require('material-design-icons/iconfont/material-icons.css')

new Vue({
  el: '#player',
  store,
  render: h => h(Player)
})

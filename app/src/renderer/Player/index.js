const Vue = require('vue')
const store = require('../store')
const Player = require('./Player.vue')

new Vue({
  el: '#player',
  store,
  render: h => h(Player)
})

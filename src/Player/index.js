const Vue = require('vue')
const store = require('./store')
const Player = require('./Player.vue')

const ipcRenderer = require('electron').ipcRenderer

new Vue({
  el: '#player',
  store,
  render: h => h(Player),
  created () {
    ipcRenderer.on('CONNECT_COMMIT', (event, type, data) => {
      console.log(type, data)
      this.$store.commit(type, JSON.parse(data))
    })
  }
})

const Vue = require('vue')
const store = require('../store')
const Controller = require('./Controller.vue')

const materializeCss = require('materialize-css/dist/css/materialize.min.css')
const materialIcons = require('material-design-icons/iconfont/material-icons.css')

const { ipcRenderer } = require('electron')

new Vue({
  el: '#controller',
  store,
  render: h => h(Controller),
  created () {
    ipcRenderer.on(types.CONNECT_COMMIT, (event, typeName, payload) => {
      this.$store.commit(typeName, JSON.parse(payload))
    })
  }
})

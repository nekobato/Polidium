const Vue = require('vue')
const store = require('./store')
const Controller = require('./Controller.vue')

const materializeCss = require('materialize-css/dist/css/materialize.min.css')
const materialIcons = require('material-design-icons/iconfont/material-icons.css')


new Vue({
  el: '#controller',
  store,
  render: h => h(Controller)
})

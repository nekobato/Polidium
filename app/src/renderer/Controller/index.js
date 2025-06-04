import { createApp } from 'vue'
import store from '../store'
import Controller from './Controller.vue'
import 'materialize-css/dist/css/materialize.min.css'
import 'material-design-icons/iconfont/material-icons.css'

createApp(Controller).use(store).mount('#controller')

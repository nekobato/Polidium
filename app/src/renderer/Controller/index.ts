import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from '../store'
import Controller from './Controller.vue'
import 'materialize-css/dist/css/materialize.min.css'
import 'material-design-icons/iconfont/material-icons.css'

createApp(Controller).use(store).use(ElementPlus).mount('#controller')

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from '../store'
import Player from './Player.vue'
import 'material-design-icons/iconfont/material-icons.css'

createApp(Player).use(store).use(ElementPlus).mount('#player')

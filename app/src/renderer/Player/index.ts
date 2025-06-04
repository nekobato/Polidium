import { createApp } from 'vue'
import store from '../store'
import Player from './Player.vue'
import 'material-design-icons/iconfont/material-icons.css'

createApp(Player).use(store).mount('#player')

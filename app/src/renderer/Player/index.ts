import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { pinia } from "../store";
import Player from "./Player.vue";

createApp(Player).use(pinia).use(ElementPlus).mount("#player");

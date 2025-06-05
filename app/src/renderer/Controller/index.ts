import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { pinia } from "../store";
import Controller from "./Controller.vue";

createApp(Controller).use(pinia).use(ElementPlus).mount("#controller");

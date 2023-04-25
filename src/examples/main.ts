import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from './router'
import TrapUI from '../packages/index'

const app = createApp(App);

app.use(ElementPlus);

app.use(TrapUI)

app.use(router);

app.mount("#app")

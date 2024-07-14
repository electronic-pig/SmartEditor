import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import { createPinia } from 'pinia'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "normalize.css";
import "./assets/css/base.css";
import "./assets/css/editor.scss";
import 'remixicon/fonts/remixicon.css'
import { useUserStore } from './stores/userStore';

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app
  .use(createPinia())
  .use(ElementPlus, { locale: zhCn, zIndex: 99999 })
  .use(router)

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");
const email = localStorage.getItem("email");
if (token) {
  const userStore = useUserStore();
  userStore.setToken(token);
  userStore.setUsername(username);
  userStore.setEmail(email);
} 
app.mount("#app");

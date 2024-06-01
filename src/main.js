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
import { useUserStore } from './stores/userStore';

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app
  .use(createPinia())
  .use(ElementPlus, { locale: zhCn })
  .use(router)

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");
if (token) {
  const userStore = useUserStore();
  userStore.setToken(token);
  userStore.setUsername(username);
  router.push("/dashboard/IndexPage");
} 
app.mount("#app");

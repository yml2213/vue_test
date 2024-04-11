import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus, {ElMessage} from 'element-plus'
import router from './router'
import './assets/less/index.less'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import store from './store/index.js'
import api from "./api/api";

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

store.commit('addMenu', router);
app.config.globalProperties.$api = api;

function checkRouter(path) {
  let hasCheck = router.getRoutes().filter(route => route.path === path);
  return !!hasCheck;

}

router.beforeEach((to, from, next) => {
  store.commit('getToken');

  const token = localStorage.getItem('token');
  console.log(token)
  if (!token && to.name !== "login") {
    ElMessage.error("当前用户未登录，请登录");
    next({name: 'login'});
  } else if (!checkRouter(to.path)) {
    ElMessage.error("当前用户未登录，请登录");
    next({name: 'login'});
  } else {
    next();
  }
});
app.use(ElementPlus);
app.use(router);
app.use(store);
app.mount('#app')

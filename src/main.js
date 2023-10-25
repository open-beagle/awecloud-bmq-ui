import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import bgui from "@/bg-ui";
import "@/bg-ui/index.scss";


import App from './App.vue'

import router from './router'
import {generateRoutes} from './router/index.js'

import './assets/item.css'
import '../src/assets/css/index.css'
import '../src/assets/css/font.css'

import store from '@/store';

import i18n from './i18n/i18n.js'

import instance from './request/http.js'

const createVue = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  createVue.component(key, component)
}

createVue.config.globalProperties.$axios = instance

import menu from './router/function.js'

//获取用户信息
function getUser() {
    return instance.get(`/msg/system/getUserInfo`)
}


Promise.all([getUser()]).then(res => {
    console.log(res);
    if (res[0].data.code == 200) {
      //已登录则记录菜单和用户信息
      store.commit('setUserInfo', res[0].data.data)
  
  
      if (res[0].data.data.userType == 1) {//超管
        store.commit('setMenu', menu.adminMenu)
        menu.menuToRouter(menu.adminMenu)
        console.log(menu);
        store.commit('setRoute',menu.adminMenu)
        
      }
    }
    generateRoutes()
    
    createVue.use(ElementPlus).use(store).use(router).use(i18n).use(bgui)
    createVue.mount('#app')
  }).catch(() => {
    createVue.use(ElementPlus).use(store).use(router).use(i18n).use(bgui)
    createVue.mount('#app')
  })

//后期加入权限处理，参考msg/ui





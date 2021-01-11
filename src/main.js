import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router/routers'

import './assets/icons' // icon
import './router/index' // permission control
import service from '@/api/http' // axios

Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.axios = service

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})

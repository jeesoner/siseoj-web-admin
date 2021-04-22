import Vue from 'vue'

import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // 全局 css
import 'normalize.css/normalize.css'

import App from '@/App'
import store from '@/store'
import router from '@/router/routers'
import '@/assets/icons' // 图标
import '@/router/index' // 权限控制

import service from '@/api/http' // axios

Vue.use(ElementUI, {
  size: 'small'
})

Vue.config.productionTip = false
Vue.prototype.$http = service

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})

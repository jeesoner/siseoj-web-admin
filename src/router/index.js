import router from './routers'
import store from '@/store'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从cookie中拿到token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // 进度条配置

const whiteList = ['/login'] // 重定向路由白名单

router.beforeEach((to, from, next) => {
  // 进度条开始
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  // next()

  // 拿到token
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登录，直接跳转到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('getInfo').then(() => { // 拉取user_info
          // 动态路由，拉取菜单
          // loadMenus(next, to)
          next()
          console.log('getInfo sucess')
        }).catch(() => {
          store.dispatch('logout').then(() => {
            console.log('logout')
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        // 登录时未拉取 菜单，在此处拉取
      } else if (store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch('updateLoadMenus')
        // loadMenus(next, to)
      } else {
        next()
      }
      NProgress.done()
    }
  } else {
    /* 没有token */

    if (whiteList.indexOf(to.path) !== -1) {
      // 放行包含白名单的路由
      next()
    } else {
      // 其他没有权限的页面重定向到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// export const loadMenus = (next, to) => {
//   buildMenus().then(res => {
//     const asyncRouter = filterAsyncRouter(res)
//     asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
//     store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
//       router.addRoutes(asyncRouter) // 动态添加可访问路由表
//       next({ ...to, replace: true })
//     })
//   })
// }

import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

/**
 * hidden: true                   默认false，当设置 true 的时候该路由不会在侧边栏出现，如401，login等页面，或者如一些编辑页面
 * alwaysShow: true               当一个路由下面的 children声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                设置 alwaysShow为true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['superAdmin','editor'] 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             设置该路由的图标
    noCache: true                默认false，如果设置为true，则不会被 <keep-alive> 缓存
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            如果设置为false，则不会在breadcrumb面包屑中显示
}
    activeMenu: '/example/list'  如果设置了路径，在侧边栏会高亮你设置的路径
  }
 */

/**
 * constantRoutes
 * 不需要动态判断权限的路由
 * 所有角色都可以看到
 */
export const constantRoutes = [
  // 后台管理页面路由
  {
    path: '/login',
    component: () => import('@/views/admin/login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/admin/dashboard/index'),
        meta: { title: '主页', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    name: 'System',
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'system1' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/admin/system/user/index'),
        meta: { title: '用户管理', icon: 'peoples' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/admin/system/role/index'),
        meta: { title: '角色管理', icon: 'role' }
      }
    ]
  },

  {
    path: '/problemset',
    component: Layout,
    name: 'Problemset',
    redirect: '/problemset/problems',
    meta: { title: '题库管理', icon: 'list' },
    children: [
      {
        path: 'problems',
        name: 'Problems',
        component: () => import('@/views/admin/problemset/problems/index'),
        meta: { title: '题目管理', icon: 'education' }
      },
      {
        path: 'tags',
        name: 'Tags',
        component: () => import('@/views/admin/problemset/tags/index'),
        meta: { title: '标签管理', icon: 'role' }
      }
    ]
  },

  {
    path: '/contest',
    component: Layout,
    name: 'Problem',
    redirect: '/problem/user',
    meta: { title: '比赛管理', icon: 'source' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/admin/system/user/index'),
        meta: { title: '普通模式', icon: 'peoples' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/admin/system/role/index'),
        meta: { title: '挑战模式', icon: 'role' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 页面 必须在最后 !!!
  // 路由是有优先级的，谁在前面就谁优先匹配，所以越精确的路由，越要放在前面
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * 需要动态判断权限并通过 addRoutes 动态添加的页面
 */

const createRouter = () =>
  new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置 router
}

export default router

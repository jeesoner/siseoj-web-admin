import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, setUser, getUser, clear } from '@/utils/auth'

const state = {
  token: getToken(),
  user: getUser(),
  roles: [],
  // 第一次加载菜单的时候用到
  loadMenus: false
}

const getters = {
  token: state => state.token || '',
  avatar: state => state.user.avatar || '',
  name: state => state.user.nickname || '',
  user: state => state.user || {}
}

const mutations = {
  // 设置token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 设置用户信息
  SET_USER: (state, user) => {
    state.user = user
  },
  // 设置角色
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  // 设置菜单
  SET_LOAD_MENUS: (state, loadMenus) => {
    state.loadMenus = loadMenus
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const rememberMe = userInfo.rememberMe
    return new Promise((resolve, reject) => {
      login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
        // 根据rememberMe判断是否设置token和user到cookie中
        setToken(res.token, rememberMe)
        setUser(res.user.user, rememberMe)
        // 将token和user设置到store中
        commit('SET_TOKEN', res.token)
        setUserInfo(res.user, commit)
        // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
        commit('SET_LOAD_MENUS', true)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        setUserInfo(res, commit)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 登出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(res => {
        logOut(commit)
        resolve()
      }).catch(error => {
        logOut(commit)
        reject(error)
      })
    })
  },

  updateLoadMenus({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOAD_MENUS', false)
    })
  }
}

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  commit('SET_USER', {})
  commit('SET_ROLES', [])
  clear()
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.permissions.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.permissions)
  }
  commit('SET_USER', res.user)
}

export default {
  state,
  getters,
  mutations,
  actions
}

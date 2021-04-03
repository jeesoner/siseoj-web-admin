import axios from 'axios'
import { Notification } from 'element-ui'
import Cookies from 'js-cookie'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router/routers'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 5000 // 请求超过时间
})

// request 拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token
      if (config.url === '/upload/avatar') { // 上传头像路径
        config.headers.post['Content-Type'] = 'multipart/form-data'
      } else {
        config.headers['Content-Type'] = 'application/json;charset=UTF-8'
      }
    }
    return config
  },
  error => {
    console.log(error)
    Notification.error({
      title: '错误',
      message: '服务器繁忙，请稍后重试',
      duration: 3000
    })
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    if (response.data.success) {
      return response.data.data
    } else {
      Notification.error({
        title: '错误',
        message: response.data.message,
        duration: 3000
      })
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response) {
      // 处理超时
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '错误',
          message: '网络请求超时',
          duration: 3000
        })
        return Promise.reject(error)
      }
      switch (error.response.status) {
        // 401 未登录 token过期
        case 401:
          store.dispatch('logout').then(() => { // 凭据失效，请重新登录
            // 用户登录界面提示
            Cookies.set('point', 401)
            router.push('/login')
          })
          break
        // 403 无权限访问或操作的请求
        case 403:
          Notification.error({
            title: '错误',
            message: error.response.data.message,
            duration: 3000
          })
          break
        case 404:
          Notification.error({
            title: '错误',
            message: '查询错误，找不到要请求的资源！',
            duration: 3000
          })
          break
        // 其他错误，直接抛出错误提示
        default:
          if (error.response.data) {
            Notification.error({
              title: '错误',
              message: error.response.data.message,
              duration: 3000
            })
          }
          break
      }
      return Promise.reject(error)
    } else {
      // 处理断网
      Notification.error({
        title: '错误',
        message: '与服务器链接出现异常，请稍后再尝试！',
        duration: 3000
      })
      return Promise.reject(error)
    }
  }
)

export default service

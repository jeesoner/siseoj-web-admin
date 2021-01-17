import axios from 'axios'
import { Message, Notification } from 'element-ui'
import Cookies from 'js-cookie'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 6000 // 请求超过时间
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
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    /**
     * @success 为 ture 表示请求成功；为 false 表示业务异常
     */
    if (res.success) {
      return res.data
    } else {
      if (res.code === 70001) { // 凭据失效，请重新登录
        store.dispatch('logout').then(() => {
          // 用户登录界面提示
          Cookies.set('point', 70001)
          location.reload()
        })
      } else if (res.code === 70002) { // 无权限访问
        Notification.error({
          title: response.data.message,
          duration: 5000
        })
      } else {
        Notification.error({
          title: response.data.message,
          duration: 5000
        })
      }
      console.log(res.message)
      return Promise.reject(res.message)
    }
  },
  error => {
    if (
      String(error)
        .toLowerCase()
        .indexOf('timeout') !== -1
    ) {
      Message.error('服务器繁忙，请稍后重试！')
    } else if (error.response.status === 404) {
      Message.error('服务器好像挂了，要不等等试试')
    } else if (error.response.status === 500) {
      Message.error('服务器内部错误！错误原因：' + error.response.data.message)
    } else {
      Message.error(error.response.data.message)
    }
    return Promise.reject(error)
  }
)

export default service

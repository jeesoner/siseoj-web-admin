import axios from 'axios'
import { MessageBox, Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Router from '../router/index'

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
    // 请求成功
    if (response.data.success) {
      return response.data
    // 请求失败
    } else {
      Notification.error({
        title: response.data.message,
        duration: 5000
      })
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

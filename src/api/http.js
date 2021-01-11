import axios from 'axios'
import { MessageBox, Message, Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Router from '../router/index'

// 创建axios实例
const service = axios.create({
  baseURL: 'localhost:8080',
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
  res => {
    console.log(res)
    if (res.data.code === 10001) {
      Notification.error({
        title: '资源不存在',
        duration: 5000,
        position: 'top-left',
        offset: 40,
        showClose: false,
        message: '请求的资源不存在'
      })
    } else if (res.data.code === 10005) {
      Notification.error({
        title: '验证码过期',
        duration: 5000,
        position: 'top-left',
        offset: 40,
        showClose: false,
        message: '验证码过期，请重新获取'
      })
    } else if (res.data.code === 20001) {
      Notification.error({
        title: '未登录',
        duration: 5000,
        position: 'top-left',
        offset: 40,
        showClose: false,
        message: '您未登录，请登录后查看'
      })
    } else if (res.data.code === 20002) {
      Notification.error({
        title: '权限不足',
        duration: 5000,
        position: 'top-left',
        offset: 40,
        showClose: false,
        message: '权限不足，请联系超级管理员！'
      })
      return res
    } else if (res.data.code === 20003) {
      MessageBox.alert('您的认证已过期，可能已在其他地方登录，如果您有疑问，请联系管理员', '认证过期', {
        confirmButtonText: '重新登录',
        type: 'error',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        center: true
      }).then(() => {
        Router.push({
          path: '/Login'
        }).catch(() => { })
        store.default.commit('LOGOUT')
      }).catch(() => {
        // 在路由中添加了相同的路由会报错 Navigating to current location ("/") is not allowed。
        // 不处理异常即可
      })
    } else if (res.data.code === 30001) {
      Notification.error({
        title: '业务执行失败',
        duration: 5000,
        position: 'top-center',
        offset: 40,
        showClose: false,
        message: res.data.msg
      })
    } else if (res.data.code === 30002) {
      Notification.error({
        title: '服务端异常',
        duration: 5000,
        position: 'top-left',
        dangerouslyUseHTMLString: true,
        offset: 40,
        showClose: false,
        message: res.data.msg
      })
    } else {
      return res
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
      Message.error('服务器内部错误！错误原因：' + error.response.data.msg)
    } else {
      Message.error(error.response.data.msg)
    }
    return Promise.reject(error)
  }
)

export default service

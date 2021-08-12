import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'brackets' })
  },
  timeout: 6000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  crossDomain: true
})

// 异常拦截处理器
const errorHandler = (error) => {
  const { res } = error
  if (res) { } else {
    notification.error({
      message: '错误',
      description: '网络开小差了，请刷新后重试哦~'
    })
  }
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: '错误',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: '错误',
        description: '未知错误'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            // this.$router.push({ path: '/user/login' })
            window.location.reload()
          }, 1500)
          // this.$router.push({ name: 'login' })
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
    config.headers['Access-Token'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}

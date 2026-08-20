import axios from 'axios'
import config from '@/config'
import { useAuthStore } from '@/stores/auth'
import { MessagePlugin } from 'tdesign-vue-next'
import i18n from '@/i18n'

const t = i18n.global.t

// 创建 axios 实例
const api = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器
api.interceptors.request.use((config) => {
  // 设置 Content-Type
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
  }
  // 如果有 token，则设置请求头
  const authStore = useAuthStore()
  if (config.isRefreshToken) {
    config.headers.Authorization = 'Bearer ' + authStore.refreshToken
  } else if (authStore.isLogined) {
    config.headers.Authorization = 'Bearer ' + authStore.accessToken
  }
  // 设置重试次数
  config.retry = (config.retry || 0) + 1
  return config
})

// 响应拦截器
api.interceptors.response.use(
  async (res) => {
    // token 过期且不是刷新 token 的请求
    const authStore = useAuthStore()
    if (
      res.data.code === 401 &&
      !res.config.isRefreshToken &&
      res.config.retry < 3 &&
      authStore.isLogined
    ) {
      // 刷新
      await authStore.requestRefreshToken()
      if (authStore.isLogined) {
        // 刷新成功 重新请求
        let config = res.config
        const newRes = await api(config)
        return newRes
      }
    }
    return res
  },
  (error) => {
    if (error.response.status === 500) {
      MessagePlugin.error(t('common.msg.500'))
    } else if (error.response.status === 404) {
      MessagePlugin.error(t('common.msg.404'))
    } else {
      MessagePlugin.error(t('common.msg.defaultError'))
    }
    console.error('[API Error]: ', error)
    return Promise.reject(error)
  },
)

export default api

export { api }

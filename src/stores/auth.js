import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { MessagePlugin } from 'tdesign-vue-next'
import config from '@/config'
import api from '@/utils/api'

import i18n from '@/i18n'
const { t } = i18n.global

// 用户状态管理
export const useAuthStore = defineStore('auth', () => {
  // 是否登录
  const isLogined = ref(false)
  // token 相关
  const accessToken = ref(null)
  const refreshToken = ref(null)
  // 用户信息
  const userProfile = ref(null)
  // 获取头像
  const avatar = computed(() => {
    return userProfile.value ? config.mediaUrl + '/' + userProfile.value.avatar : null
  })

  // 初始化登录态
  async function initAuth() {
    const localAccessToken = localStorage.getItem('nettedx_access_token')
    const localrefreshToken = localStorage.getItem('nettedx_refresh_token')
    if (localAccessToken && localrefreshToken) {
      isLogined.value = true
      accessToken.value = localAccessToken
      refreshToken.value = localrefreshToken
      userProfile.value = JSON.parse(localStorage.getItem('nettedx_user_profile'))
      // 刷新用户信息
      await requestUserProfile()
    } else {
      isLogined.value = false
      accessToken.value = null
      refreshToken.value = null
      userProfile.value = null
    }
  }
  initAuth() // 从本地存储中初始化登录态

  // 持久化登录态
  watch(accessToken, (newValue) => {
    if (newValue) {
      isLogined.value = true
      localStorage.setItem('nettedx_access_token', newValue)
    } else {
      isLogined.value = false
      localStorage.removeItem('nettedx_access_token')
    }
  })
  watch(refreshToken, (newValue) => {
    if (newValue) {
      localStorage.setItem('nettedx_refresh_token', newValue)
    } else {
      localStorage.removeItem('nettedx_refresh_token')
    }
  })
  watch(userProfile, (newValue) => {
    if (newValue) {
      localStorage.setItem('nettedx_user_profile', JSON.stringify(newValue))
    } else {
      localStorage.removeItem('nettedx_user_profile')
    }
  })

  // 获取用户信息
  async function requestUserProfile() {
    return new Promise((resolve) => {
      api({
        method: 'get',
        url: '/auth/profile',
      })
        .then((res) => {
          if (res.data.code == 200) {
            userProfile.value = res.data.data
            resolve(res.data.data)
          } else {
            throw new Error(res)
          }
        })
        .catch((e) => {
          console.error(e)
          MessagePlugin.error(t('common.msg.sessionExpired'))
          logout()
        })
    })
  }

  // promise
  let refreshPromise = null
  let lastRefreshTime = null
  // 刷新 token
  function requestRefreshToken() {
    // 如果正在刷新 token，则直接返回
    if (refreshPromise) {
      return refreshPromise
    }
    // 如果距离上次刷新 token 不到 1 minute，则不再刷新
    if (lastRefreshTime && new Date().getTime() - lastRefreshTime < 60 * 1000) {
      return refreshPromise
    }
    console.log('refresh token')
    refreshPromise = api({
      method: 'get',
      url: '/user/refresh',
      headers: {
        Authorization: 'Bearer ' + refreshToken.value,
      },
      isRefreshToken: true,
    })
      .then((res) => {
        if (res.data.code == 200) {
          accessToken.value = res.data.data.access
          refreshToken.value = res.data.data.refresh
          lastRefreshTime = new Date().getTime()
          console.log('refresh token success')
        } else {
          throw new Error(res)
        }
      })
      .catch((e) => {
        console.error(e)
        MessagePlugin.error(t('common.msg.sessionExpired'))
        logout()
      })
      .finally(() => {
        refreshPromise = null
        console.log('refresh token done')
      })
    return refreshPromise
  }

  // 路由
  const router = useRouter()
  const route = useRoute()
  // 登出
  function logout() {
    // 清除登录态
    accessToken.value = null
    refreshToken.value = null
    userProfile.value = null
    isLogined.value = false
    // 跳转到登录页
    const path = route.path
    const redirect = route.query.redirect
    router.replace({
      path: '/login',
      query: {
        redirect: redirect || path,
      },
    })
  }

  return {
    isLogined,
    accessToken,
    refreshToken,
    userProfile,
    avatar,
    initAuth,
    requestUserProfile,
    requestRefreshToken,
    logout,
  }
})

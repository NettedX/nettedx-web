import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

// 主题状态管理
export const useThemeStore = defineStore('theme', () => {
  // 主题设置：'auto' | 'light' | 'dark'
  const themeSetting = ref(localStorage.getItem('theme-setting') || 'auto')
  // 当前主题：'light' | 'dark'
  const theme = ref('light')
  // zh-CN 主题名称
  const themName = {
    light: '浅色',
    dark: '深色',
    auto: '跟随系统',
  }

  // 检测系统主题
  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // 应用主题到 html 标签
  function applyTheme(t) {
    // 设置主题值
    theme.value = t
    // 设置 html 属性
    if (t === 'dark') {
      document.documentElement.setAttribute('theme-mode', 'dark')
    } else {
      document.documentElement.removeAttribute('theme-mode')
    }
  }

  // 根据设置切换主题
  function updateTheme() {
    if (themeSetting.value === 'auto') {
      applyTheme(getSystemTheme())
    } else {
      applyTheme(themeSetting.value)
    }
  }

  // 切换主题设置
  function setTheme(setting) {
    themeSetting.value = setting
    localStorage.setItem('theme-setting', setting)
    updateTheme()
  }

  // 监听系统主题变化
  let mediaQuery
  updateTheme()
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', updateTheme)

  // 监听 themeSetting 变化
  watch(themeSetting, updateTheme)

  // 获取主题名称
  function getThemeName() {
    return themName[themeSetting.value]
  }

  return {
    themeSetting,
    theme,
    setTheme,
    updateTheme,
    getThemeName,
  }
})

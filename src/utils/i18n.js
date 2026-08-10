import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import enUSConfig from 'tdesign-vue-next/es/locale/en_US'
import zhCNConfig from 'tdesign-vue-next/es/locale/zh_CN'
import zhTWConfig from 'tdesign-vue-next/es/locale/zh_TW'

export const useLocale = () => {
  const i18n = useI18n()

  // 设置语言
  function changeLocale(locale) {
    localStorage.setItem('locale', locale)
    const route = useRoute()
    const router = useRouter()
    router.push({
      name: route.name,
      params: {
        ...route.params,
        locale,
      },
    })
  }

  // 获取当前语言
  const getLocale = () => {
    return i18n.locale.value
  }

  // 国际化翻译函数
  const t = (key) => {
    return i18n.t(key)
  }

  // 当前tdesign语言配置
  const tdesignLang = computed(() => {
    if (i18n.locale.value === 'zh-CN') {
      return zhCNConfig
    } else if (i18n.locale.value === 'zh-TW') {
      return zhTWConfig
    }
    return enUSConfig
  })

  // 可选语言列表
  const localeOptions = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'zh-TW', label: '繁體中文' },
    { value: 'en-US', label: 'English' },
  ]

  return {
    changeLocale,
    getLocale,
    t,
    locale: i18n.locale,
    tdesignLang,
    localeOptions,
  }
}

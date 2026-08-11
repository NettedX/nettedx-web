import { createI18n } from 'vue-i18n'
import zhCN from '@/i18n/locales/zh-CN.json'
import zhTW from '@/i18n/locales/zh-TW.json'
import enUS from '@/i18n/locales/en-US.json'

// 获取默认语言
const getDefaultLocale = () => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    return savedLocale
  }

  const browserLocale = navigator.language.toLowerCase()
  if (browserLocale.startsWith('zh-cn')) {
    return 'zh-CN'
  } else if (browserLocale.startsWith('zh-tw')) {
    return 'zh-TW'
  }
  return 'en-US'
}

const messages = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS,
}

const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en-US',
  messages,
})

export default i18n

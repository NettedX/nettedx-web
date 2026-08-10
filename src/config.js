import i18n from '@/i18n'

// 运行模式
// PROD: 生产环境
// TEST: 测试环境
// DEV: 开发环境
const MODE = 'PROD'

const appName = 'NettedX'

const _apiUrlConfig = {
  PROD: 'https://api.nettedx.com',
  TEST: 'https://apitest.nettedx.com',
  DEV: 'http://localhost:8000',
}
const apiUrl = _apiUrlConfig[MODE] || _apiUrlConfig.DEV

export default {
  appName,
  apiUrl,
}

// 运行模式
// PROD: 生产环境
// TEST: 测试环境
// DEV: 开发环境
const MODE = 'PROD'

const appName = 'NettedX'

const _apiUrlConfig = {
  PROD: 'https://api.nettedx.com/v1',
  TEST: 'https://apitest.nettedx.com/v1',
  DEV: 'http://localhost:8000/v1',
}
const apiUrl = _apiUrlConfig[MODE] || _apiUrlConfig.DEV

export default {
  appName,
  apiUrl,
}

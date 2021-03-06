/**
 * 环境配置
 */
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/6793725d16390a94839cacd93d254e25/api'
  },
  test: {
    baseApi: '//test.futurefe.com/api',
    mockApi: 'https://www.fastmock.site/mock/6793725d16390a94839cacd93d254e25/api'
  },
  prod: {
    baseApi: '//futurefe.com/api',
    mockApi: 'https://www.fastmock.site/mock/6793725d16390a94839cacd93d254e25/api'
  }
}

export default {
  env,
  mock: false,
  namespace: 'manager',
  ...EnvConfig[env]
}

import axios from 'axios'
import { ElMessage } from 'element-plus'
import config from '../config'
import router from '../router'
import storage from '../utils/storage'

const TOKEN_INVALID = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000
})

service.interceptors.request.use(function (req) {
  const headers = req.headers
  const { token } = storage.getItem('userInfo')
  if (!headers.Authorization) headers.Authorization = 'Bearer ' + token
  return req
})

service.interceptors.response.use(function (res) {
  const { code, data, msg } = res.data
  if (code === 200) {
    return data
  } else if (code === 50001) {
    ElMessage.error(TOKEN_INVALID)
    setTimeout(() => {
      router.push('/login')
    }, 15000)
    return Promise.reject(TOKEN_INVALID)
  } else {
    const errMsg = msg || NETWORK_ERROR
    ElMessage.error(errMsg)
    return Promise.reject(errMsg)
  }
})

function request(options) {
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }

  if (typeof options.mock !== 'undefined') {
    config.mock = options.mock
  }


  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
  }

  return service(options)
}

;['get', 'post', 'put', 'delete', 'patch'].forEach((method) => {
  request[method] = function (url, data, options) {
    return request({
      url,
      data,
      method,
      ...options
    })
  }
})

export default request

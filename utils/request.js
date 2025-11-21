import store from '@/store'
import config from '@/config'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { toast, showConfirm, tansParams } from '@/utils/common'

let timeout = 10000
const baseUrl = config.baseUrl

const request = config => {
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  config.header = config.header || {}
  if (getToken() && !isToken) {
    config.header['Authorization'] = 'Bearer ' + getToken()
  }
  // get请求映射params参数
  if (config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.url = url
  }
  return new Promise((resolve, reject) => {
    const requestUrl = config.baseUrl ? config.baseUrl + config.url : baseUrl + config.url;
    
    // 打印请求调试信息
    console.log('=== HTTP请求调试信息 ===');
    console.log('请求方法:', config.method || 'get');
    console.log('请求地址:', requestUrl);
    console.log('请求头:', config.header);
    console.log('请求数据:', config.data);
    
    uni.request({
        method: config.method || 'get',
        timeout: config.timeout ||  timeout,
        url: requestUrl,
        data: config.data,
        header: config.header,
        dataType: 'json'
      }).then(response => {
        console.log('=== HTTP响应调试信息 ===');
        console.log('响应状态:', response.statusCode);
        console.log('响应数据:', response.data);
       /* let [error, res] = response
        if (error) {
          toast('后端接口连接异常')
          reject('后端接口连接异常')
          return
        } */
		const res=response
        const code = res.data.code || 200
        const msg = errorCode[code] || res.data.msg || errorCode['default']
        if (code === 401) {
          showConfirm('登录状态已过期，您可以继续留在该页面，或者重新登录?').then(res => {
            if (res.confirm) {
              store.dispatch('LogOut').then(res => {
                uni.reLaunch({ url: '/pages/login' })
              })
            }
          })
          reject('无效的会话，或者会话已过期，请重新登录。')
        } else if (code === 500) {
          toast(msg)
          reject('500')
        } else if (code !== 200) {
          toast(msg)
          reject(code)
        }
        resolve(res.data)
      })
      .catch(error => {
        let { message } = error
        // 确保message是字符串，避免undefined错误
        if (!message) {
          message = error.toString() || '网络请求失败'
        }
        
        if (message === 'Network Error') {
          message = '后端接口连接异常'
        } else if (message && message.includes('timeout')) {
          message = '系统接口请求超时'
        } else if (message && message.includes('Request failed with status code')) {
          message = '系统接口' + message.substr(message.length - 3) + '异常'
        }
        toast(message)
        reject(error)
      })
  })
}

export default request

import request from '@/utils/request'

/**
 * 生成校友身份二维码
 * @returns {Promise} 返回二维码数据
 */
export function generateQRCode() {
  return request({
    url: '/core/studentInfo/QRCode',
    baseUrl: 'http://10.155.10.148:8082',
    method: 'get',
    timeout: 10000
  })
}

/**
 * 获取用户校友信息
 * @returns {Promise} 返回用户校友信息
 */
export function getAlumniInfo() {
  return request({
    url: '/core/studentInfo/info',
    baseUrl: 'http://10.155.10.148:8082',
    method: 'get'
  })
}

/**
 * 验证二维码有效性
 * @param {string} qrcode 二维码内容
 * @returns {Promise} 返回验证结果
 */
export function verifyQRCode(qrcode) {
  return request({
    url: '/core/studentInfo/verifyQRCode',
    baseUrl: 'http://10.155.10.148:8082',
    method: 'post',
    data: {
      qrcode
    }
  })
}

import request from '@/utils/request'
import { getToken } from '@/utils/auth'

// 获取新闻列表
export function getNewsList(query) {
  return request({
    url: '/core/news/list',
    method: 'get',
    params: query
  })
}

// 获取新闻详细信息
export function getNewsDetail(id) {
  return request({
    url: `/core/news/${id}`,
    method: 'get'
  })
}

// 导出新闻管理列表
export function exportNewsList(query) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `http://10.155.10.148:8090/prod-api/core/news/export`,
      method: 'POST',
      data: query,
      header: {
        'Authorization': 'Bearer ' + (getToken() || ''),
        'Content-Type': 'application/json'
      },
      responseType: 'text', // 接收文件数据
      success: (res) => {
        console.log('导出响应状态:', res.statusCode)
        console.log('导出响应数据类型:', typeof res.data)
        console.log('导出响应前100字符:', res.data ? res.data.substring(0, 100) : 'null')
        
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`HTTP ${res.statusCode}`))
        }
      },
      fail: (error) => {
        console.error('导出请求失败:', error)
        reject(error)
      }
    })
  })
}

// 新增新闻
export function addNews(data) {
  return request({
    url: '/core/news',
    method: 'post',
    data: data
  })
}

// 修改新闻
export function updateNews(data) {
  return request({
    url: '/core/news',
    method: 'put',
    data: data
  })
}

// 删除新闻
export function delNews(id) {
  return request({
    url: `/core/news/${id}`,
    method: 'delete'
  })
}

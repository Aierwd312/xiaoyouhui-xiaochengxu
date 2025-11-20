// 新闻管理API测试文件
// 用于测试新闻相关功能的API调用

import { getNewsList, getNewsDetail, exportNewsList } from '@/api/news'

/**
 * 测试获取新闻列表功能
 */
export async function testGetNewsList() {
  console.log('开始测试获取新闻列表...')
  
  try {
    const params = {
      pageNum: 1,
      pageSize: 10,
      title: '' // 可以为空或包含搜索关键词
    }
    
    const response = await getNewsList(params)
    console.log('新闻列表响应:', response)
    
    if (response.code === 200) {
      console.log('✅ 获取新闻列表成功')
      console.log(`共获取到 ${response.data.total} 条新闻`)
      return response.data
    } else {
      console.log('❌ 获取新闻列表失败:', response.msg)
      return null
    }
  } catch (error) {
    console.error('❌ 获取新闻列表异常:', error)
    return null
  }
}

/**
 * 测试获取新闻详情功能
 */
export async function testGetNewsDetail(newsId) {
  console.log(`开始测试获取新闻详情 (ID: ${newsId})...`)
  
  try {
    const response = await getNewsDetail(newsId)
    console.log('新闻详情响应:', response)
    
    if (response.code === 200) {
      console.log('✅ 获取新闻详情成功')
      console.log('新闻标题:', response.data.title)
      return response.data
    } else {
      console.log('❌ 获取新闻详情失败:', response.msg)
      return null
    }
  } catch (error) {
    console.error('❌ 获取新闻详情异常:', error)
    return null
  }
}

/**
 * 测试导出新闻列表功能
 */
export async function testExportNewsList() {
  console.log('开始测试导出新闻列表...')
  
  try {
    const params = {
      title: '' // 可以为空或包含搜索关键词
    }
    
    const response = await exportNewsList(params)
    console.log('导出新闻列表响应:', response)
    
    if (response.code === 200) {
      console.log('✅ 导出新闻列表成功')
      return response.data
    } else {
      console.log('❌ 导出新闻列表失败:', response.msg)
      return null
    }
  } catch (error) {
    console.error('❌ 导出新闻列表异常:', error)
    return null
  }
}

/**
 * 运行所有测试
 */
export async function runAllTests() {
  console.log('🚀 开始运行新闻管理API测试...')
  
  // 测试获取新闻列表
  const newsList = await testGetNewsList()
  
  // 如果获取到新闻列表且有数据，测试获取详情
  if (newsList && newsList.rows && newsList.rows.length > 0) {
    const firstNews = newsList.rows[0]
    await testGetNewsDetail(firstNews.id)
  }
  
  // 测试导出功能
  await testExportNewsList()
  
  console.log('✨ 新闻管理API测试完成')
}

/**
 * 模拟数据测试（当后端API不可用时）
 */
export function getMockNewsData() {
  return {
    code: 200,
    msg: '操作成功',
    data: {
      total: 3,
      rows: [
        {
          id: 1,
          title: '重庆财经学院2024年校友年会成功举办',
          backgroundImage: 'https://example.com/news1.jpg',
          url: 'https://example.com/news/1',
          createTime: '2025-11-03 15:34:51',
          updateTime: '2025-11-03 15:34:51',
          createBy: '管理员',
          updateBy: '管理员',
          remark: '本次校友年会汇聚了来自全国各地的优秀校友，共同回顾母校发展历程，展望未来发展前景。'
        },
        {
          id: 2,
          title: '母校新图书馆正式启用',
          backgroundImage: 'https://example.com/news2.jpg',
          url: 'https://example.com/news/2',
          createTime: '2025-11-02 10:20:30',
          updateTime: '2025-11-02 10:20:30',
          createBy: '新闻中心',
          updateBy: '新闻中心',
          remark: '新图书馆总建筑面积达到2万平方米，藏书量超过100万册，为师生提供更好的学习环境。'
        },
        {
          id: 3,
          title: '校友企业家论坛圆满落幕',
          backgroundImage: 'https://example.com/news3.jpg',
          url: 'https://example.com/news/3',
          createTime: '2025-11-01 14:15:20',
          updateTime: '2025-11-01 14:15:20',
          createBy: '校友办',
          updateBy: '校友办',
          remark: '论坛邀请了多位知名校友企业家分享创业经验，为在校学生提供宝贵的职业指导。'
        }
      ]
    }
  }
}

/**
 * 使用模拟数据进行功能测试
 */
export function testWithMockData() {
  console.log('🧪 使用模拟数据进行功能测试...')
  
  const mockData = getMockNewsData()
  console.log('模拟新闻列表数据:', mockData)
  
  // 测试数据格式
  if (mockData.code === 200 && mockData.data && mockData.data.rows) {
    console.log('✅ 模拟数据格式正确')
    console.log(`模拟数据包含 ${mockData.data.total} 条新闻`)
    
    // 测试单条新闻数据结构
    const firstNews = mockData.data.rows[0]
    const requiredFields = ['id', 'title', 'createTime', 'createBy']
    const missingFields = requiredFields.filter(field => !firstNews[field])
    
    if (missingFields.length === 0) {
      console.log('✅ 新闻数据结构完整')
    } else {
      console.log('❌ 新闻数据缺少字段:', missingFields)
    }
  } else {
    console.log('❌ 模拟数据格式错误')
  }
  
  console.log('✨ 模拟数据测试完成')
}

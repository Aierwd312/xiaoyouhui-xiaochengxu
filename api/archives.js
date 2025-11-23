import request from '@/utils/request'

// 档案材料申请API基础地址（注意：使用8082端口）
const ARCHIVES_BASE_URL = 'http://10.155.10.148:8082'

/**
 * 查询档案材料申请列表
 * @param {Object} query - 查询参数
 */
export function getArchiveApplicationList(query) {
  console.log('=== 查询档案申请列表API调用 ===');
  console.log('基础地址:', ARCHIVES_BASE_URL);
  console.log('接口路径:', '/core/archivesApplications/list');
  console.log('查询参数:', query);
  
  const result = request({
    baseUrl: ARCHIVES_BASE_URL,
    url: '/core/archivesApplications/list',
    method: 'get',
    params: query
  });
  
  result.then(response => {
    console.log('=== 列表API调用成功 ===');
    console.log('响应数据:', response);
  }).catch(error => {
    console.log('=== 列表API调用失败 ===');
    console.log('错误信息:', error);
  });
  
  return result;
}

/**
 * 获取档案材料申请详情
 * @param {String|Number} id - 申请ID
 */
export function getArchiveApplicationDetail(id) {
  return request({
    baseUrl: ARCHIVES_BASE_URL,
    url: `/core/archivesApplications/${id}`,
    method: 'get'
  })
}

/**
 * 新增档案材料申请
 * @param {Object} data - 申请数据
 */
export function addArchiveApplication(data) {
  console.log('=== 新增档案申请API调用 ===');
  console.log('基础地址:', ARCHIVES_BASE_URL);
  console.log('接口路径:', '/core/archivesApplications/');
  console.log('完整地址:', `${ARCHIVES_BASE_URL}/core/archivesApplications/`);
  console.log('请求数据:', data);
  
  const result = request({
    baseUrl: ARCHIVES_BASE_URL,
    url: '/core/archivesApplications/',
    method: 'post',
    data: data
  });
  
  result.then(response => {
    console.log('=== API调用成功 ===');
    console.log('响应数据:', response);
  }).catch(error => {
    console.log('=== API调用失败 ===');
    console.log('错误信息:', error);
  });
  
  return result;
}

/**
 * 修改档案材料申请
 * @param {Object} data - 申请数据（包含id）
 */
export function updateArchiveApplication(data) {
  return request({
    baseUrl: ARCHIVES_BASE_URL,
    url: '/core/archivesApplications',
    method: 'put',
    data: data
  })
}

/**
 * 删除档案材料申请
 * @param {String|Number} id - 申请ID
 */
export function deleteArchiveApplication(id) {
  return request({
    baseUrl: ARCHIVES_BASE_URL,
    url: `/core/archivesApplications/${id}`,
    method: 'delete'
  })
}

/**
 * 批量删除档案材料申请
 * @param {Array} ids - 申请ID数组
 */
export function batchDeleteArchiveApplication(ids) {
  return request({
    baseUrl: ARCHIVES_BASE_URL,
    url: `/core/archivesApplications/${ids}`,
    method: 'delete'
  })
}

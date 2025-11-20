import request from '@/utils/request'

/**
 * 获取学生详细信息
 * @param {number} id 学生ID
 * @returns {Promise} 返回学生详细信息
 */
export function getStudentInfo(id) {
  return request({
    url: `/core/students/${id}`,
    method: 'get'
  })
}

/**
 * 查询校友数据列表
 * @param {Object} params 查询参数
 * @param {string} params.id 学生ID
 * @param {string} params.name 姓名
 * @param {string} params.academy 学院
 * @param {string} params.classname 班级
 * @param {string} params.studentNumber 学号
 * @param {string} params.grade 年级
 * @param {string} params.idCard 身份证号
 * @param {string} params.phone 联系电话
 * @param {string} params.email 电子邮箱
 * @param {string} params.industry 所属行业
 * @param {string} params.company 工作单位
 * @param {number} params.userId 关联用户ID
 * @param {string} params.createdAt 创建时间
 * @param {string} params.updatedAt 更新时间
 * @param {string} params.createBy 创建者
 * @param {string} params.createTime 创建时间
 * @param {string} params.updateBy 更新者
 * @param {string} params.updateTime 更新时间
 * @param {string} params.remark 备注
 * @param {Object} params.params 其他参数
 * @returns {Promise} 返回校友列表数据，格式: {total: number, rows: Array, code: number, msg: string}
 */
export function getStudentsList(params = {}) {
  return request({
    url: '/core/students/list',
    method: 'get',
    params: params
  })
}

/**
 * 获取好友列表
 * @returns {Promise} 返回好友列表
 */
export function getFriendsList() {
  return request({
    url: '/core/friends/list',
    method: 'get'
  })
}

/**
 * 添加好友
 * @param {number} friendId 好友ID
 * @returns {Promise} 返回添加结果
 */
export function addFriend(friendId) {
  return request({
    url: '/core/friends',
    method: 'post',
    data: {
      friendId
    }
  })
}

/**
 * 删除好友
 * @param {number} friendId 好友ID
 * @returns {Promise} 返回删除结果
 */
export function removeFriend(friendId) {
  return request({
    url: `/core/friends/${friendId}`,
    method: 'delete'
  })
}

/**
 * 获取好友申请列表
 * @returns {Promise} 返回好友申请列表
 */
export function getFriendRequests() {
  return request({
    url: '/core/friend-requests',
    method: 'get'
  })
}

/**
 * 处理好友申请
 * @param {number} requestId 申请ID
 * @param {string} action 操作类型 'accept' | 'reject'
 * @returns {Promise} 返回处理结果
 */
export function handleFriendRequest(requestId, action) {
  return request({
    url: `/core/friend-requests/${requestId}`,
    method: 'put',
    data: {
      action
    }
  })
}

/**
 * 搜索用户
 * @param {string} keyword 搜索关键词
 * @returns {Promise} 返回搜索结果
 */
export function searchUsers(keyword) {
  return request({
    url: '/core/students-search',
    method: 'get',
    params: {
      keyword
    }
  })
}
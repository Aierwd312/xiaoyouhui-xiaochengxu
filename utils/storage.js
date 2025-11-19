import constant from './constant'

// 存储变量名
let storageKey = 'storage_data'

// 存储节点变量名
let storageNodeKeys = [constant.avatar, constant.name, constant.roles, constant.permissions]

// 存储的数据
let storageData = uni.getStorageSync(storageKey) || {}

const storage = {
  set: function(key, value) {
    if (storageNodeKeys.indexOf(key) != -1) {
      let tmp = uni.getStorageSync(storageKey)
      tmp = tmp ? tmp : {}
      tmp[key] = value
      uni.setStorageSync(storageKey, tmp)
    }
  },
  get: function(key) {
    // 每次获取时重新从storage读取，确保数据是最新的
    let tmp = uni.getStorageSync(storageKey) || {}
    return tmp[key] || ""
  },
  remove: function(key) {
    let tmp = uni.getStorageSync(storageKey) || {}
    delete tmp[key]
    uni.setStorageSync(storageKey, tmp)
  },
  clean: function() {
    uni.removeStorageSync(storageKey)
  }
}

export default storage

"use strict";
const common_vendor = require("../common/vendor.js");
const utils_constant = require("./constant.js");
let storageKey = "storage_data";
let storageNodeKeys = [utils_constant.constant.avatar, utils_constant.constant.name, utils_constant.constant.roles, utils_constant.constant.permissions];
common_vendor.index.getStorageSync(storageKey) || {};
const storage = {
  set: function(key, value) {
    if (storageNodeKeys.indexOf(key) != -1) {
      let tmp = common_vendor.index.getStorageSync(storageKey);
      tmp = tmp ? tmp : {};
      tmp[key] = value;
      common_vendor.index.setStorageSync(storageKey, tmp);
    }
  },
  get: function(key) {
    let tmp = common_vendor.index.getStorageSync(storageKey) || {};
    return tmp[key] || "";
  },
  remove: function(key) {
    let tmp = common_vendor.index.getStorageSync(storageKey) || {};
    delete tmp[key];
    common_vendor.index.setStorageSync(storageKey, tmp);
  },
  clean: function() {
    common_vendor.index.removeStorageSync(storageKey);
  }
};
exports.storage = storage;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/storage.js.map

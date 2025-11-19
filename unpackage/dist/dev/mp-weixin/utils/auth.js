"use strict";
const common_vendor = require("../common/vendor.js");
const TokenKey = "App-Token";
function getToken() {
  return common_vendor.index.getStorageSync(TokenKey);
}
function setToken(token) {
  return common_vendor.index.setStorageSync(TokenKey, token);
}
function removeToken() {
  return common_vendor.index.removeStorageSync(TokenKey);
}
exports.getToken = getToken;
exports.removeToken = removeToken;
exports.setToken = setToken;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/auth.js.map

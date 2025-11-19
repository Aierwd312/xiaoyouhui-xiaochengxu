"use strict";
const utils_request = require("../utils/request.js");
function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  };
  return utils_request.request({
    "url": "/login",
    headers: {
      isToken: false
    },
    "method": "post",
    "data": data
  });
}
function getInfo() {
  return utils_request.request({
    "url": "/getInfo",
    "method": "get"
  });
}
function logout() {
  return utils_request.request({
    "url": "/logout",
    "method": "post"
  });
}
function getCodeImg() {
  return utils_request.request({
    "url": "/captchaImage",
    headers: {
      isToken: false
    },
    method: "get",
    timeout: 2e4
  });
}
exports.getCodeImg = getCodeImg;
exports.getInfo = getInfo;
exports.login = login;
exports.logout = logout;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/login.js.map

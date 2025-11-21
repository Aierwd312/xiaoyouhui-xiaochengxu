"use strict";
const common_vendor = require("../common/vendor.js");
const store_index = require("../store/index.js");
const config = require("../config.js");
const utils_auth = require("./auth.js");
const utils_errorCode = require("./errorCode.js");
const utils_common = require("./common.js");
let timeout = 1e4;
const baseUrl = config.config.baseUrl;
const request = (config2) => {
  const isToken = (config2.headers || {}).isToken === false;
  config2.header = config2.header || {};
  if (utils_auth.getToken() && !isToken) {
    config2.header["Authorization"] = "Bearer " + utils_auth.getToken();
  }
  if (config2.params) {
    let url = config2.url + "?" + utils_common.tansParams(config2.params);
    url = url.slice(0, -1);
    config2.url = url;
  }
  return new Promise((resolve, reject) => {
    const requestUrl = config2.baseUrl ? config2.baseUrl + config2.url : baseUrl + config2.url;
    common_vendor.index.__f__("log", "at utils/request.js:27", "=== HTTP请求调试信息 ===");
    common_vendor.index.__f__("log", "at utils/request.js:28", "请求方法:", config2.method || "get");
    common_vendor.index.__f__("log", "at utils/request.js:29", "请求地址:", requestUrl);
    common_vendor.index.__f__("log", "at utils/request.js:30", "请求头:", config2.header);
    common_vendor.index.__f__("log", "at utils/request.js:31", "请求数据:", config2.data);
    common_vendor.index.request({
      method: config2.method || "get",
      timeout: config2.timeout || timeout,
      url: requestUrl,
      data: config2.data,
      header: config2.header,
      dataType: "json"
    }).then((response) => {
      common_vendor.index.__f__("log", "at utils/request.js:41", "=== HTTP响应调试信息 ===");
      common_vendor.index.__f__("log", "at utils/request.js:42", "响应状态:", response.statusCode);
      common_vendor.index.__f__("log", "at utils/request.js:43", "响应数据:", response.data);
      const res = response;
      const code = res.data.code || 200;
      const msg = utils_errorCode.errorCode[code] || res.data.msg || utils_errorCode.errorCode["default"];
      if (code === 401) {
        utils_common.showConfirm("登录状态已过期，您可以继续留在该页面，或者重新登录?").then((res2) => {
          if (res2.confirm) {
            store_index.store.dispatch("LogOut").then((res3) => {
              common_vendor.index.reLaunch({ url: "/pages/login" });
            });
          }
        });
        reject("无效的会话，或者会话已过期，请重新登录。");
      } else if (code === 500) {
        utils_common.toast(msg);
        reject("500");
      } else if (code !== 200) {
        utils_common.toast(msg);
        reject(code);
      }
      resolve(res.data);
    }).catch((error) => {
      let { message } = error;
      if (!message) {
        message = error.toString() || "网络请求失败";
      }
      if (message === "Network Error") {
        message = "后端接口连接异常";
      } else if (message && message.includes("timeout")) {
        message = "系统接口请求超时";
      } else if (message && message.includes("Request failed with status code")) {
        message = "系统接口" + message.substr(message.length - 3) + "异常";
      }
      utils_common.toast(message);
      reject(error);
    });
  });
};
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map

"use strict";
const common_vendor = require("../common/vendor.js");
const store_index = require("../store/index.js");
const config = require("../config.js");
const utils_auth = require("./auth.js");
const utils_errorCode = require("./errorCode.js");
const utils_common = require("./common.js");
let timeout = 1e4;
const baseUrl = config.config.baseUrl;
const upload = (config2) => {
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
    common_vendor.index.uploadFile({
      timeout: config2.timeout || timeout,
      url: baseUrl + config2.url,
      filePath: config2.filePath,
      name: config2.name || "file",
      header: config2.header,
      formData: config2.formData,
      success: (res) => {
        let result = JSON.parse(res.data);
        const code = result.code || 200;
        const msg = utils_errorCode.errorCode[code] || result.msg || utils_errorCode.errorCode["default"];
        if (code === 200) {
          resolve(result);
        } else if (code == 401) {
          utils_common.showConfirm("登录状态已过期，您可以继续留在该页面，或者重新登录?").then((res2) => {
            if (res2.confirm) {
              store_index.store.dispatch("LogOut").then((res3) => {
                common_vendor.index.reLaunch({ url: "/pages/login/login" });
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
      },
      fail: (error) => {
        let { message } = error;
        if (message == "Network Error") {
          message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
          message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
          message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        utils_common.toast(message);
        reject(error);
      }
    });
  });
};
exports.upload = upload;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/upload.js.map

"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const utils_auth = require("../utils/auth.js");
function getNewsList(query) {
  return utils_request.request({
    url: "/core/news/list",
    method: "get",
    params: query
  });
}
function getNewsDetail(id) {
  return utils_request.request({
    url: `/core/news/${id}`,
    method: "get"
  });
}
function exportNewsList(query) {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: `http://10.155.10.148:8090/prod-api/core/news/export`,
      method: "POST",
      data: query,
      header: {
        "Authorization": "Bearer " + (utils_auth.getToken() || ""),
        "Content-Type": "application/json"
      },
      responseType: "text",
      // 接收文件数据
      success: (res) => {
        common_vendor.index.__f__("log", "at api/news.js:34", "导出响应状态:", res.statusCode);
        common_vendor.index.__f__("log", "at api/news.js:35", "导出响应数据类型:", typeof res.data);
        common_vendor.index.__f__("log", "at api/news.js:36", "导出响应前100字符:", res.data ? res.data.substring(0, 100) : "null");
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      },
      fail: (error) => {
        common_vendor.index.__f__("error", "at api/news.js:45", "导出请求失败:", error);
        reject(error);
      }
    });
  });
}
exports.exportNewsList = exportNewsList;
exports.getNewsDetail = getNewsDetail;
exports.getNewsList = getNewsList;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/news.js.map

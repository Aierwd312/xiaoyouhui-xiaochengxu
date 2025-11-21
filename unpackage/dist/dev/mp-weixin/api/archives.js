"use strict";
const common_vendor = require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const ARCHIVES_BASE_URL = "http://10.155.10.148:8082";
function getArchiveApplicationList(query) {
  common_vendor.index.__f__("log", "at api/archives.js:11", "=== 查询档案申请列表API调用 ===");
  common_vendor.index.__f__("log", "at api/archives.js:12", "基础地址:", ARCHIVES_BASE_URL);
  common_vendor.index.__f__("log", "at api/archives.js:13", "接口路径:", "/core/archivesApplications/list");
  common_vendor.index.__f__("log", "at api/archives.js:14", "查询参数:", query);
  const result = utils_request.request({
    baseUrl: ARCHIVES_BASE_URL,
    url: "/core/archivesApplications/list",
    method: "get",
    params: query
  });
  result.then((response) => {
    common_vendor.index.__f__("log", "at api/archives.js:24", "=== 列表API调用成功 ===");
    common_vendor.index.__f__("log", "at api/archives.js:25", "响应数据:", response);
  }).catch((error) => {
    common_vendor.index.__f__("log", "at api/archives.js:27", "=== 列表API调用失败 ===");
    common_vendor.index.__f__("log", "at api/archives.js:28", "错误信息:", error);
  });
  return result;
}
function addArchiveApplication(data) {
  common_vendor.index.__f__("log", "at api/archives.js:51", "=== 新增档案申请API调用 ===");
  common_vendor.index.__f__("log", "at api/archives.js:52", "基础地址:", ARCHIVES_BASE_URL);
  common_vendor.index.__f__("log", "at api/archives.js:53", "接口路径:", "/core/archivesApplications");
  common_vendor.index.__f__("log", "at api/archives.js:54", "完整地址:", `${ARCHIVES_BASE_URL}/core/archivesApplications`);
  common_vendor.index.__f__("log", "at api/archives.js:55", "请求数据:", data);
  const result = utils_request.request({
    baseUrl: ARCHIVES_BASE_URL,
    url: "/core/archivesApplications",
    method: "post",
    data
  });
  result.then((response) => {
    common_vendor.index.__f__("log", "at api/archives.js:65", "=== API调用成功 ===");
    common_vendor.index.__f__("log", "at api/archives.js:66", "响应数据:", response);
  }).catch((error) => {
    common_vendor.index.__f__("log", "at api/archives.js:68", "=== API调用失败 ===");
    common_vendor.index.__f__("log", "at api/archives.js:69", "错误信息:", error);
  });
  return result;
}
function updateArchiveApplication(data) {
  return utils_request.request({
    baseUrl: ARCHIVES_BASE_URL,
    url: "/core/archivesApplications",
    method: "put",
    data
  });
}
function deleteArchiveApplication(id) {
  return utils_request.request({
    baseUrl: ARCHIVES_BASE_URL,
    url: `/core/archivesApplications/${id}`,
    method: "delete"
  });
}
exports.addArchiveApplication = addArchiveApplication;
exports.deleteArchiveApplication = deleteArchiveApplication;
exports.getArchiveApplicationList = getArchiveApplicationList;
exports.updateArchiveApplication = updateArchiveApplication;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/archives.js.map

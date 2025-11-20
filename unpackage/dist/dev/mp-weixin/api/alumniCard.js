"use strict";
const utils_request = require("../utils/request.js");
function generateQRCode() {
  return utils_request.request({
    url: "/core/studentInfo/QRCode",
    baseUrl: "http://10.155.10.148:8082",
    method: "get",
    timeout: 1e4
  });
}
function getAlumniInfo() {
  return utils_request.request({
    url: "/core/studentInfo/info",
    baseUrl: "http://10.155.10.148:8082",
    method: "get"
  });
}
exports.generateQRCode = generateQRCode;
exports.getAlumniInfo = getAlumniInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/alumniCard.js.map

"use strict";
const utils_upload = require("../../utils/upload.js");
const utils_request = require("../../utils/request.js");
function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  };
  return utils_request.request({
    url: "/system/user/profile/updatePwd",
    method: "put",
    params: data
  });
}
function getUserProfile() {
  return utils_request.request({
    url: "/system/user/profile",
    method: "get"
  });
}
function updateUserProfile(data) {
  return utils_request.request({
    url: "/system/user/profile",
    method: "put",
    data
  });
}
function uploadAvatar(data) {
  return utils_upload.upload({
    url: "/system/user/profile/avatar",
    name: data.name,
    filePath: data.filePath
  });
}
exports.getUserProfile = getUserProfile;
exports.updateUserProfile = updateUserProfile;
exports.updateUserPwd = updateUserPwd;
exports.uploadAvatar = uploadAvatar;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/api/system/user.js.map

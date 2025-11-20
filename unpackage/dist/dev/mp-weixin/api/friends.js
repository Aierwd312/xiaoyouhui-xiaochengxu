"use strict";
const utils_request = require("../utils/request.js");
function getFriendsList() {
  return utils_request.request({
    url: "/core/friends/list",
    method: "get"
  });
}
function removeFriend(friendId) {
  return utils_request.request({
    url: `/core/friends/${friendId}`,
    method: "delete"
  });
}
function getFriendRequests() {
  return utils_request.request({
    url: "/core/friend-requests",
    method: "get"
  });
}
function handleFriendRequest(requestId, action) {
  return utils_request.request({
    url: `/core/friend-requests/${requestId}`,
    method: "put",
    data: {
      action
    }
  });
}
exports.getFriendRequests = getFriendRequests;
exports.getFriendsList = getFriendsList;
exports.handleFriendRequest = handleFriendRequest;
exports.removeFriend = removeFriend;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/friends.js.map

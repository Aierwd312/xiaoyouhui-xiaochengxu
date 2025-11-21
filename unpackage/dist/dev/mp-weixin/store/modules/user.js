"use strict";
const config = require("../../config.js");
const utils_storage = require("../../utils/storage.js");
const utils_constant = require("../../utils/constant.js");
const api_login = require("../../api/login.js");
const utils_auth = require("../../utils/auth.js");
config.config.baseUrl;
const user = {
  state: {
    token: utils_auth.getToken(),
    name: utils_storage.storage.get(utils_constant.constant.name),
    nickName: utils_storage.storage.get(utils_constant.constant.nickName),
    avatar: utils_storage.storage.get(utils_constant.constant.avatar),
    roles: utils_storage.storage.get(utils_constant.constant.roles),
    permissions: utils_storage.storage.get(utils_constant.constant.permissions)
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
      utils_storage.storage.set(utils_constant.constant.name, name);
    },
    SET_NICKNAME: (state, nickName) => {
      state.nickName = nickName;
      utils_storage.storage.set(utils_constant.constant.nickName, nickName);
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
      utils_storage.storage.set(utils_constant.constant.avatar, avatar);
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
      utils_storage.storage.set(utils_constant.constant.roles, roles);
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
      utils_storage.storage.set(utils_constant.constant.permissions, permissions);
    }
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username;
      const password = userInfo.password;
      const code = userInfo.code;
      const uuid = userInfo.uuid;
      return new Promise((resolve, reject) => {
        api_login.login(username, password, code, uuid).then((res) => {
          utils_auth.setToken(res.token);
          commit("SET_TOKEN", res.token);
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        api_login.getInfo().then((res) => {
          const user2 = res.user;
          const avatar = user2 == null || user2.avatar == "" || user2.avatar == null ? "/static/images/profile.jpg" : user2.avatar;
          const username = user2 == null || user2.userName == "" || user2.userName == null ? "" : user2.userName;
          const nickName = user2 == null || user2.nickName == "" || user2.nickName == null ? "" : user2.nickName;
          if (res.roles && res.roles.length > 0) {
            commit("SET_ROLES", res.roles);
            commit("SET_PERMISSIONS", res.permissions);
          } else {
            commit("SET_ROLES", ["ROLE_DEFAULT"]);
          }
          commit("SET_NAME", username);
          commit("SET_NICKNAME", nickName);
          commit("SET_AVATAR", avatar);
          resolve(res);
        }).catch((error) => {
          reject(error);
        });
      });
    },
    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        api_login.logout(state.token).then(() => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          commit("SET_PERMISSIONS", []);
          utils_auth.removeToken();
          utils_storage.storage.clean();
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    }
  }
};
exports.user = user;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/store/modules/user.js.map

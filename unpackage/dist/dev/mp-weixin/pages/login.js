"use strict";
const common_vendor = require("../common/vendor.js");
const common_assets = require("../common/assets.js");
const api_login = require("../api/login.js");
require("../store/modules/user.js");
const config = require("../config.js");
const store_index = require("../store/index.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const codeUrl = common_vendor.ref("");
    const captchaEnabled = common_vendor.ref(true);
    const globalConfig = common_vendor.ref(config.config);
    const loginForm = common_vendor.ref({
      username: "",
      password: "",
      code: "",
      uuid: ""
    });
    function handlePrivacy() {
      let site = globalConfig.value.appInfo.agreements[0];
      common_vendor.index.navigateTo({
        url: `/pages/common/webview/index?title=${site.title}&url=${site.url}`
      });
    }
    function handleUserAgrement() {
      let site = globalConfig.value.appInfo.agreements[1];
      common_vendor.index.navigateTo({
        url: `/pages/common/webview/index?title=${site.title}&url=${site.url}`
      });
    }
    function getCode() {
      api_login.getCodeImg().then((res) => {
        captchaEnabled.value = res.captchaEnabled === void 0 ? true : res.captchaEnabled;
        if (captchaEnabled.value) {
          codeUrl.value = "data:image/gif;base64," + res.img;
          loginForm.value.uuid = res.uuid;
        }
      });
    }
    async function handleLogin() {
      if (loginForm.value.username === "") {
        common_vendor.index.showToast({
          title: "请输入您的账号",
          mask: false,
          duration: 1e3
        });
      } else if (loginForm.value.password === "") {
        common_vendor.index.showToast({
          title: "请输入您的密码",
          mask: false,
          duration: 1e3
        });
      } else if (loginForm.value.code === "" && captchaEnabled.value) {
        common_vendor.index.showToast({
          title: "请输入验证码",
          mask: false,
          duration: 1e3
        });
      } else {
        common_vendor.index.showToast({
          title: "登录中，请耐心等待...",
          mask: false,
          duration: 1e3
        });
        pwdLogin();
      }
    }
    async function pwdLogin() {
      store_index.store.dispatch("Login", loginForm.value).then(() => {
        loginSuccess();
      }).catch(() => {
        if (captchaEnabled.value) {
          getCode();
        }
      });
    }
    function loginSuccess(result) {
      store_index.store.dispatch("GetInfo").then((res) => {
        common_vendor.index.navigateTo({
          url: "/pages/index/index"
        });
      });
    }
    getCode();
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_1,
        b: loginForm.value.username,
        c: common_vendor.o(($event) => loginForm.value.username = $event.detail.value),
        d: loginForm.value.password,
        e: common_vendor.o(($event) => loginForm.value.password = $event.detail.value),
        f: captchaEnabled.value
      }, captchaEnabled.value ? {
        g: loginForm.value.code,
        h: common_vendor.o(($event) => loginForm.value.code = $event.detail.value),
        i: codeUrl.value,
        j: common_vendor.o(getCode)
      } : {}, {
        k: common_vendor.o(handleLogin),
        l: common_vendor.o(handleUserAgrement),
        m: common_vendor.o(handlePrivacy)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../.sourcemap/mp-weixin/pages/login.js.map

"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_auth = require("./utils/auth.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login.js";
  "./pages/notificationsPage/notificationsPage.js";
  "./pages/userProfilePage/userProfilePage.js";
  "./pages/alumniCardPage/alumniCardPage.js";
  "./pages/discoverAlumniPage/discoverAlumniPage.js";
  "./pages/myFriendsPage/myFriendsPage.js";
  "./pages/myOrganizationsPage/myOrganizationsPage.js";
  "./pages/studentInfoPage/studentInfoPage.js";
  "./pages/archiveQueryPage/archiveQueryPage.js";
  "./pages/schoolActivitiesPage/schoolActivitiesPage.js";
  "./pages/schoolNewsPage/schoolNewsPage.js";
  "./pages/campusAccessApplicationPage/campusAccessApplicationPage.js";
  "./pages/giveBackToSchoolPage/giveBackToSchoolPage.js";
  "./pages/alumniServicesPage/alumniServicesPage.js";
  "./pages/mine/index.js";
  "./pages/mine/avatar/index.js";
  "./pages/mine/info/index.js";
  "./pages/mine/info/edit.js";
  "./pages/mine/pwd/index.js";
  "./pages/mine/setting/index.js";
  "./pages/mine/help/index.js";
  "./pages/mine/about/index.js";
  "./pages/common/webview/index.js";
  "./pages/common/textview/index.js";
  "./pages/feedbackPage/feedbackPage.js";
  "./pages/systemHelpPage/systemHelpPage.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Launch");
    this.checkLoginStatus();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:12", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:15", "App Hide");
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const token = utils_auth.getToken();
      common_vendor.index.__f__("log", "at App.vue:21", "检查登录状态，token:", token);
      if (token) {
        store_index.store.dispatch("GetInfo").then(() => {
          common_vendor.index.__f__("log", "at App.vue:26", "自动登录成功，用户信息已恢复");
        }).catch((error) => {
          common_vendor.index.__f__("log", "at App.vue:29", "Token已过期，需要重新登录", error);
          store_index.store.dispatch("LogOut");
        });
      } else {
        common_vendor.index.__f__("log", "at App.vue:34", "未找到登录信息");
      }
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map

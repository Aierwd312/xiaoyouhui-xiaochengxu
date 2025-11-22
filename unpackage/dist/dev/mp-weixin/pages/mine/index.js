"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/storage.js");
const store_index = require("../../store/index.js");
const config = require("../../config.js");
if (!Array) {
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup_dialog + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const name = store_index.store.state.user.nickName;
    config.config.appInfo.version;
    const avatar = common_vendor.ref(store_index.store.state.user.avatar);
    common_vendor.ref(common_vendor.index.getSystemInfoSync().windowHeight - 50);
    const popup = common_vendor.ref(null);
    common_vendor.index.$on("refresh", () => {
      avatar.value = store_index.store.state.user.avatar;
    });
    common_vendor.index.__f__("log", "at pages/mine/index.vue:140", avatar.value);
    function handleToInfo() {
      common_vendor.index.navigateTo({
        url: "/pages/mine/info/index"
      });
    }
    function handleToEditInfo() {
      common_vendor.index.navigateTo({
        url: "/pages/mine/info/edit"
      });
    }
    function handleToSetting() {
      common_vendor.index.navigateTo({
        url: "/pages/mine/setting/index"
      });
    }
    function handleToLogin() {
      common_vendor.index.reLaunch({
        url: "/pages/login"
      });
    }
    function handleToAvatar() {
      common_vendor.index.navigateTo({
        url: "/pages/mine/avatar/index"
      });
    }
    function handleLogout() {
      popup.value.open();
    }
    function dialogConfirm() {
      store_index.store.dispatch("LogOut").then(() => {
        common_vendor.index.reLaunch({
          url: "/pages/login"
        });
      });
    }
    function dialogClose() {
    }
    function handleHelp() {
      common_vendor.index.navigateTo({
        url: "/pages/mine/help/index"
      });
    }
    function handleAbout() {
      common_vendor.index.navigateTo({
        url: "/pages/mine/about/index"
      });
    }
    function handleJiaoLiuQun() {
      common_vendor.index.showToast({
        title: "QQ群：133713780",
        mask: false,
        icon: "none",
        duration: 1e3
      });
    }
    function handleBuilding() {
      common_vendor.index.showToast({
        title: "模块建设中~",
        mask: false,
        icon: "none",
        duration: 1e3
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: avatar.value
      }, avatar.value ? {
        b: avatar.value
      } : {}, {
        c: common_vendor.o(($event) => avatar.value ? handleToAvatar() : handleToLogin()),
        d: !common_vendor.unref(name)
      }, !common_vendor.unref(name) ? {
        e: common_vendor.o(handleToLogin)
      } : {
        f: common_vendor.t(common_vendor.unref(name)),
        g: common_vendor.o(handleToInfo)
      }, {
        h: common_vendor.o(handleJiaoLiuQun),
        i: common_vendor.o(handleBuilding),
        j: common_vendor.o(handleBuilding),
        k: common_vendor.o(handleBuilding),
        l: common_vendor.o(handleToEditInfo),
        m: common_vendor.o(handleHelp),
        n: common_vendor.o(handleAbout),
        o: common_vendor.o(handleToSetting),
        p: common_vendor.o(handleLogout),
        q: common_vendor.o(dialogConfirm),
        r: common_vendor.o(dialogClose),
        s: common_vendor.p({
          type: "info",
          cancelText: "关闭",
          confirmText: "退出",
          title: "通知",
          content: "确定注销并退出系统吗"
        }),
        t: common_vendor.sr(popup, "55ad7e00-0", {
          "k": "popup"
        }),
        v: common_vendor.p({
          type: "dialog"
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/index.js.map

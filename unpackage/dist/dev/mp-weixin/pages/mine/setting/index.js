"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_index = require("../../../store/index.js");
if (!Array) {
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_popup_dialog = () => "../../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup_dialog + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const windowHeight = common_vendor.ref(common_vendor.index.getSystemInfoSync().windowHeight);
    const popup = common_vendor.ref(null);
    function handleToPwd() {
      common_vendor.index.navigateTo({
        url: "/pages/mine/pwd/index"
      });
    }
    function handleToUpgrade() {
      common_vendor.index.showToast({
        title: "模块建设中~",
        mask: false,
        icon: "none",
        duration: 1e3
      });
    }
    function handleCleanTmp() {
      common_vendor.index.showToast({
        title: "模块建设中~",
        mask: false,
        icon: "none",
        duration: 1e3
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
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleToPwd),
        b: common_vendor.o(handleToUpgrade),
        c: common_vendor.o(handleCleanTmp),
        d: common_vendor.o(handleLogout),
        e: `${windowHeight.value}px`,
        f: common_vendor.o(dialogConfirm),
        g: common_vendor.o(dialogClose),
        h: common_vendor.p({
          type: "info",
          cancelText: "关闭",
          confirmText: "退出",
          title: "通知",
          content: "确定注销并退出系统吗"
        }),
        i: common_vendor.sr(popup, "d9df6a80-0", {
          "k": "popup"
        }),
        j: common_vendor.p({
          type: "dialog"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d9df6a80"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/setting/index.js.map

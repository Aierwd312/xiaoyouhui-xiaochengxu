"use strict";
const api_system_user = require("../../../api/system/user.js");
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      user: {},
      roleGroup: "",
      postGroup: ""
    };
  },
  onLoad() {
    this.getUser();
  },
  methods: {
    getUser() {
      api_system_user.getUserProfile().then((response) => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  (_easycom_uni_list_item2 + _easycom_uni_list2)();
}
const _easycom_uni_list_item = () => "../../../uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "../../../uni_modules/uni-list/components/uni-list/uni-list.js";
if (!Math) {
  (_easycom_uni_list_item + _easycom_uni_list)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      showExtraIcon: "true",
      extraIcon: {
        type: "person-filled"
      },
      title: "昵称",
      rightText: $data.user.nickName
    }),
    b: common_vendor.p({
      showExtraIcon: "true",
      extraIcon: {
        type: "phone-filled"
      },
      title: "手机号码",
      rightText: $data.user.phonenumber
    }),
    c: common_vendor.p({
      showExtraIcon: "true",
      extraIcon: {
        type: "email-filled"
      },
      title: "邮箱",
      rightText: $data.user.email
    }),
    d: common_vendor.p({
      showExtraIcon: "true",
      extraIcon: {
        type: "auth-filled"
      },
      title: "岗位",
      rightText: $data.postGroup
    }),
    e: common_vendor.p({
      showExtraIcon: "true",
      extraIcon: {
        type: "staff-filled"
      },
      title: "角色",
      rightText: $data.roleGroup
    }),
    f: common_vendor.p({
      showExtraIcon: "true",
      extraIcon: {
        type: "calendar-filled"
      },
      title: "创建日期",
      rightText: $data.user.createTime
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/info/index.js.map

"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_system_user = require("../../../api/system/user.js");
const _sfc_main = {
  data() {
    return {
      user: {
        nickName: "",
        phonenumber: "",
        email: "",
        sex: ""
      },
      sexs: [{
        text: "男",
        value: "0"
      }, {
        text: "女",
        value: "1"
      }],
      rules: {
        nickName: {
          rules: [{
            required: true,
            errorMessage: "用户昵称不能为空"
          }]
        },
        phonenumber: {
          rules: [{
            required: true,
            errorMessage: "手机号码不能为空"
          }, {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            errorMessage: "请输入正确的手机号码"
          }]
        },
        email: {
          rules: [{
            required: true,
            errorMessage: "邮箱地址不能为空"
          }, {
            format: "email",
            errorMessage: "请输入正确的邮箱地址"
          }]
        }
      }
    };
  },
  onLoad() {
    this.getUser();
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  methods: {
    getUser() {
      api_system_user.getUserProfile().then((response) => {
        this.user = response.data;
      });
    },
    submit(ref) {
      this.$refs.form.validate().then((res) => {
        api_system_user.updateUserProfile(this.user).then((response) => {
          common_vendor.index.showToast({
            title: "修改成功",
            mask: false,
            duration: 1e3
          });
          common_vendor.index.navigateBack();
        });
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_checkbox2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_checkbox = () => "../../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_checkbox + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.user.nickName = $event),
    b: common_vendor.p({
      placeholder: "请输入昵称",
      modelValue: $data.user.nickName
    }),
    c: common_vendor.p({
      label: "用户昵称",
      name: "nickName"
    }),
    d: common_vendor.o(($event) => $data.user.phonenumber = $event),
    e: common_vendor.p({
      placeholder: "请输入手机号码",
      modelValue: $data.user.phonenumber
    }),
    f: common_vendor.p({
      label: "手机号码",
      name: "phonenumber"
    }),
    g: common_vendor.o(($event) => $data.user.email = $event),
    h: common_vendor.p({
      placeholder: "请输入邮箱",
      modelValue: $data.user.email
    }),
    i: common_vendor.p({
      label: "邮箱",
      name: "email"
    }),
    j: common_vendor.o(($event) => $data.user.sex = $event),
    k: common_vendor.p({
      localdata: $data.sexs,
      modelValue: $data.user.sex
    }),
    l: common_vendor.p({
      label: "性别",
      name: "sex",
      required: true
    }),
    m: common_vendor.sr("form", "ccf9e70e-0"),
    n: common_vendor.p({
      model: $data.user,
      labelWidth: "80px"
    }),
    o: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/info/edit.js.map

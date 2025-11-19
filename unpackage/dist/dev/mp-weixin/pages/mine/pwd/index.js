"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_system_user = require("../../../api/system/user.js");
const _sfc_main = {
  data() {
    return {
      user: {
        oldPassword: void 0,
        newPassword: void 0,
        confirmPassword: void 0
      },
      rules: {
        oldPassword: {
          rules: [{
            required: true,
            errorMessage: "旧密码不能为空"
          }]
        },
        newPassword: {
          rules: [
            {
              required: true,
              errorMessage: "新密码不能为空"
            },
            {
              minLength: 6,
              maxLength: 20,
              errorMessage: "长度在 6 到 20 个字符"
            }
          ]
        },
        confirmPassword: {
          rules: [
            {
              required: true,
              errorMessage: "确认密码不能为空"
            },
            {
              validateFunction: (rule, value, data) => data.newPassword === value,
              errorMessage: "两次输入的密码不一致"
            }
          ]
        }
      }
    };
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  methods: {
    submit() {
      this.$refs.form.validate().then((res) => {
        api_system_user.updateUserPwd(this.user.oldPassword, this.user.newPassword).then((response) => {
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
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.user.oldPassword = $event),
    b: common_vendor.p({
      type: "password",
      placeholder: "请输入旧密码",
      modelValue: $data.user.oldPassword
    }),
    c: common_vendor.p({
      name: "oldPassword",
      label: "旧密码"
    }),
    d: common_vendor.o(($event) => $data.user.newPassword = $event),
    e: common_vendor.p({
      type: "password",
      placeholder: "请输入新密码",
      modelValue: $data.user.newPassword
    }),
    f: common_vendor.p({
      name: "newPassword",
      label: "新密码"
    }),
    g: common_vendor.o(($event) => $data.user.confirmPassword = $event),
    h: common_vendor.p({
      type: "password",
      placeholder: "请确认新密码",
      modelValue: $data.user.confirmPassword
    }),
    i: common_vendor.p({
      name: "confirmPassword",
      label: "确认密码"
    }),
    j: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    k: common_vendor.sr("form", "52ca995f-0"),
    l: common_vendor.p({
      value: $data.user,
      labelWidth: "80px"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/pwd/index.js.map

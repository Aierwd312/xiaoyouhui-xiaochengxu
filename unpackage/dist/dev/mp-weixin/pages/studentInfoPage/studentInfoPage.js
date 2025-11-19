"use strict";
const common_vendor = require("../../common/vendor.js");
const studentInfoPageJs = {
  data() {
    return {
      // 导航栏配置
      navBackground: "#F0F4F8",
      // 导航栏背景色 - 与页面背景色保持一致
      navTitleColor: "#004299",
      // 导航栏标题颜色 - 重财蓝，在浅色背景上使用深色文字
      // 表单数据
      formData: {
        enrollmentType: "",
        // 入校类型
        enrollmentDept: "",
        // 入校院系
        studentId: ""
        // 学号（选填）
      },
      // 入校类型选择器
      typePickerShow: false,
      // 控制入校类型选择器显示
      typeOptions: ["本科", "硕士研究生", "博士研究生", "专升本", "其他"],
      // 院系选择器
      deptPickerShow: false,
      // 控制院系选择器显示
      // 院系数据 - 联动格式
      deptOptions: [
        {
          text: "会计学院",
          value: "01",
          children: [
            { text: "会计学", value: "01-01" },
            { text: "财务管理", value: "01-02" },
            { text: "审计学", value: "01-03" }
          ]
        },
        {
          text: "金融学院",
          value: "02",
          children: [
            { text: "金融学", value: "02-01" },
            { text: "投资学", value: "02-02" },
            { text: "保险学", value: "02-03" }
          ]
        },
        {
          text: "工商管理学院",
          value: "03",
          children: [
            { text: "市场营销", value: "03-01" },
            { text: "人力资源管理", value: "03-02" },
            { text: "物流管理", value: "03-03" }
          ]
        },
        {
          text: "经济学院",
          value: "04",
          children: [
            { text: "经济学", value: "04-01" },
            { text: "国际经济与贸易", value: "04-02" }
          ]
        },
        {
          text: "法学院",
          value: "05",
          children: [
            { text: "法学", value: "05-01" },
            { text: "知识产权", value: "05-02" }
          ]
        },
        {
          text: "信息学院",
          value: "06",
          children: [
            { text: "计算机科学与技术", value: "06-01" },
            { text: "软件工程", value: "06-02" },
            { text: "信息管理与信息系统", value: "06-03" }
          ]
        },
        {
          text: "外国语学院",
          value: "07",
          children: [
            { text: "英语", value: "07-01" },
            { text: "商务英语", value: "07-02" }
          ]
        },
        {
          text: "统计学院",
          value: "08",
          children: [
            { text: "统计学", value: "08-01" },
            { text: "应用统计学", value: "08-02" }
          ]
        },
        {
          text: "国际商学院",
          value: "09",
          children: [
            { text: "国际商务", value: "09-01" },
            { text: "跨境电子商务", value: "09-02" }
          ]
        }
      ]
    };
  },
  onLoad() {
  },
  methods: {
    /**
     * 返回上一页
     */
    goBack() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    /**
     * 显示入校类型选择器
     */
    showTypePicker() {
      this.typePickerShow = true;
    },
    /**
     * 选择入校类型
     * @param {Object} e 选择事件对象，包含选中项的数据
     */
    selectType(e) {
      common_vendor.index.__f__("log", "at pages/studentInfoPage/studentInfoPage.js:127", "选择的入校类型:", e);
      this.formData.enrollmentType = e.text;
      this.typePickerShow = false;
    },
    /**
     * 显示入校院系选择器
     */
    showDeptPicker() {
      this.deptPickerShow = true;
    },
    /**
     * 选择入校院系
     * @param {Object} e 选择事件对象，包含选中项的数据
     */
    selectDept(e) {
      common_vendor.index.__f__("log", "at pages/studentInfoPage/studentInfoPage.js:144", "选择的入校院系:", e);
      this.formData.enrollmentDept = `${e.text[0]}-${e.text[1]}`;
      this.deptPickerShow = false;
    },
    /**
     * 提交表单
     */
    submitForm() {
      if (!this.formData.enrollmentType) {
        common_vendor.index.showToast({
          title: "请选择入校类型",
          icon: "none"
        });
        return;
      }
      if (!this.formData.enrollmentDept) {
        common_vendor.index.showToast({
          title: "请选择入校院系",
          icon: "none"
        });
        return;
      }
      common_vendor.index.__f__("log", "at pages/studentInfoPage/studentInfoPage.js:174", "提交的数据:", this.formData);
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "提交成功",
          icon: "success",
          duration: 2e3,
          success: () => {
            setTimeout(() => {
              common_vendor.index.navigateBack({
                delta: 1
              });
            }, 2e3);
          }
        });
      }, 1500);
    }
  }
};
const _sfc_main = studentInfoPageJs;
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_fui_input2 = common_vendor.resolveComponent("fui-input");
  const _easycom_fui_form_item2 = common_vendor.resolveComponent("fui-form-item");
  const _easycom_fui_picker2 = common_vendor.resolveComponent("fui-picker");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_fui_input2 + _easycom_fui_form_item2 + _easycom_fui_picker2)();
}
const _easycom_fui_icon = () => "../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_fui_input = () => "../../components/firstui/fui-input/fui-input.js";
const _easycom_fui_form_item = () => "../../components/firstui/fui-form-item/fui-form-item.js";
const _easycom_fui_picker = () => "../../components/firstui/fui-picker/fui-picker.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar + _easycom_fui_input + _easycom_fui_form_item + _easycom_fui_picker)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      name: "arrowleft",
      color: _ctx.navTitleColor,
      size: "40"
    }),
    b: common_vendor.p({
      name: "more-vertical",
      color: _ctx.navTitleColor,
      size: "40"
    }),
    c: common_vendor.p({
      name: "target",
      color: _ctx.navTitleColor,
      size: "40"
    }),
    d: common_vendor.o(_ctx.goBack),
    e: common_vendor.p({
      title: "添加学籍信息",
      background: _ctx.navBackground,
      titleColor: _ctx.navTitleColor
    }),
    f: common_vendor.o(($event) => _ctx.formData.enrollmentType = $event),
    g: common_vendor.p({
      borderBottom: false,
      padding: [0],
      placeholder: "请选择入校类型",
      disabled: true,
      backgroundColor: "transparent",
      modelValue: _ctx.formData.enrollmentType
    }),
    h: common_vendor.o(_ctx.showTypePicker),
    i: common_vendor.p({
      label: "入校类型",
      arrow: true,
      highlight: true
    }),
    j: common_vendor.o(($event) => _ctx.formData.enrollmentDept = $event),
    k: common_vendor.p({
      borderBottom: false,
      padding: [0],
      placeholder: "请选择入校院系",
      disabled: true,
      backgroundColor: "transparent",
      modelValue: _ctx.formData.enrollmentDept
    }),
    l: common_vendor.o(_ctx.showDeptPicker),
    m: common_vendor.p({
      label: "入校院系",
      arrow: true,
      highlight: true
    }),
    n: common_vendor.o(($event) => _ctx.formData.studentId = $event),
    o: common_vendor.p({
      borderBottom: false,
      padding: [0],
      placeholder: "选填",
      modelValue: _ctx.formData.studentId
    }),
    p: common_vendor.p({
      label: "学号"
    }),
    q: common_vendor.o((...args) => _ctx.submitForm && _ctx.submitForm(...args)),
    r: common_vendor.o(_ctx.selectType),
    s: common_vendor.o(($event) => _ctx.typePickerShow = false),
    t: common_vendor.p({
      options: _ctx.typeOptions,
      show: _ctx.typePickerShow,
      title: "请选择入校类型",
      confirmText: "确定",
      cancelText: "取消",
      height: 650,
      size: 14
    }),
    v: common_vendor.o(_ctx.selectDept),
    w: common_vendor.o(($event) => _ctx.deptPickerShow = false),
    x: common_vendor.p({
      linkage: true,
      layer: 2,
      options: _ctx.deptOptions,
      show: _ctx.deptPickerShow,
      title: "请选择入校院系",
      confirmText: "确定",
      cancelText: "取消",
      height: 650,
      size: 14
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/studentInfoPage/studentInfoPage.js.map

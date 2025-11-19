"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      // 导航栏高度
      navHeight: 44,
      statusBarHeight: 0,
      // 功能指南列表
      functionGuides: [
        {
          title: "校友卡",
          icon: "bank-card-2-line",
          iconClass: "svg-blue",
          content: "校友卡是您在重财校友网络中的电子身份证，包含您的校友信息、学历认证等。可用于校内场馆预约、图书馆借阅、参加校友活动等。",
          expanded: false
        },
        {
          title: "发现校友",
          icon: "user-search-line",
          iconClass: "svg-darkblue",
          content: "通过地区、院系、入学年份等多维度筛选，找到与您志同道合的校友，扩展您的人脉网络。",
          expanded: false
        },
        {
          title: "母校活动",
          icon: "calendar-event-line",
          iconClass: "svg-orange",
          content: "浏览并报名参加母校举办的各类活动，包括学术讲座、校友聚会、校庆活动等。您还可以查看活动回顾和相册。",
          expanded: false
        },
        {
          title: "进校申请",
          icon: "building-4-line",
          iconClass: "svg-darkblue",
          content: "校友返校参观需提前申请。通过此功能，您可以在线提交进校申请，获得电子通行证，便捷入校。",
          expanded: false
        }
      ],
      // 常见问题列表
      faqs: [
        {
          question: "如何认证校友身份？",
          answer: '在"个人中心"页面点击"校友认证"，填写您的学号、姓名、入学年份等信息，系统将自动与学校数据库匹配。若信息无误，将在1-3个工作日内完成认证。',
          expanded: false
        },
        {
          question: "忘记账号密码怎么办？",
          answer: '请点击登录页面的"忘记密码"，通过绑定的手机号或邮箱进行身份验证，然后重置密码。如果无法找回，请联系客服协助处理。',
          expanded: false
        },
        {
          question: "如何更新个人信息？",
          answer: '在"个人中心"页面点击"编辑资料"，可以更新您的联系方式、工作信息、地址等个人资料。',
          expanded: false
        },
        {
          question: "如何参加校友活动？",
          answer: '在"母校活动"页面浏览近期活动，点击感兴趣的活动详情页，然后点击"报名参加"按钮完成报名。报名成功后，您将收到确认通知和活动提醒。',
          expanded: false
        },
        {
          question: "如何联系其他校友？",
          answer: '通过"发现校友"页面找到目标校友，点击其头像进入详情页，可以查看联系方式或发送好友请求。建立联系后，可以在"我的好友"中进行沟通交流。',
          expanded: false
        }
      ]
    };
  },
  onLoad() {
  },
  methods: {
    // 导航栏初始化
    navbarInit(e) {
      this.statusBarHeight = e.statusBarHeight;
      this.navHeight = e.height + e.statusBarHeight;
    },
    // 返回上一页
    goBack() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    // 切换功能指南展开状态
    toggleGuide(index) {
      this.functionGuides[index].expanded = !this.functionGuides[index].expanded;
      this.functionGuides.forEach((item, i) => {
        if (i !== index && item.expanded) {
          item.expanded = false;
        }
      });
    },
    // 切换常见问题展开状态
    toggleFaq(index) {
      this.faqs[index].expanded = !this.faqs[index].expanded;
      this.faqs.forEach((item, i) => {
        if (i !== index && item.expanded) {
          item.expanded = false;
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2)();
}
const _easycom_fui_icon = () => "../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      name: "arrowleft",
      size: 48,
      color: "#333333"
    }),
    b: common_vendor.o($options.navbarInit),
    c: common_vendor.o($options.goBack),
    d: common_vendor.p({
      statusBar: true,
      title: "系统帮助",
      background: "#F0F4F8",
      color: "#333333",
      size: 18,
      isFixed: true,
      fontWeight: 500
    }),
    e: common_assets._imports_0$2,
    f: common_assets._imports_1$2,
    g: common_vendor.f($data.functionGuides, (item, index, i0) => {
      return common_vendor.e({
        a: "/static/" + item.icon + ".svg",
        b: common_vendor.n(item.iconClass),
        c: common_vendor.t(item.title),
        d: item.expanded ? 1 : "",
        e: common_vendor.o(($event) => $options.toggleGuide(index), index),
        f: item.expanded
      }, item.expanded ? {
        g: common_vendor.t(item.content)
      } : {}, {
        h: index !== $data.functionGuides.length - 1
      }, index !== $data.functionGuides.length - 1 ? {} : {}, {
        i: index
      });
    }),
    h: common_assets._imports_2$1,
    i: common_assets._imports_3,
    j: common_vendor.f($data.faqs, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.question),
        b: item.expanded ? 1 : "",
        c: common_vendor.o(($event) => $options.toggleFaq(index), index),
        d: item.expanded
      }, item.expanded ? {
        e: common_vendor.t(item.answer)
      } : {}, {
        f: index !== $data.faqs.length - 1
      }, index !== $data.faqs.length - 1 ? {} : {}, {
        g: index
      });
    }),
    k: common_assets._imports_2$1,
    l: common_assets._imports_4,
    m: common_assets._imports_5,
    n: common_assets._imports_6,
    o: common_assets._imports_7,
    p: $data.navHeight + "px"
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/systemHelpPage/systemHelpPage.js.map

"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const alumniCardPageJs = {
  data() {
    return {
      // 导航栏配置
      navBackground: "#F0F4F8",
      // 导航栏背景色 - 与页面背景色保持一致
      navTitleColor: "#004299",
      // 导航栏标题颜色 - 重财蓝，在浅色背景上使用深色文字
      // 用户信息
      userInfo: {
        name: "张三",
        // 用户姓名
        enrollmentYear: "2025",
        // 入学年份
        educationType: "本科",
        // 入学类型：本科、专升本等
        faculty: "会计学院",
        // 院系
        avatar: ""
        // 头像URL，为空则使用默认头像
      },
      // 二维码数据
      qrcodeValue: "",
      // 二维码内容
      qrcodeExpireTime: 0,
      // 二维码过期时间戳
      // 是否显示二维码
      showQRCode: false
    };
  },
  onLoad() {
    this.generateQRCode();
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
     * 生成二维码
     */
    generateQRCode() {
      const timestamp = Date.now();
      const expireTime = timestamp + 30 * 60 * 1e3;
      const qrcodeContent = `alumni_${this.userInfo.name}_${timestamp}_${expireTime}`;
      this.qrcodeValue = qrcodeContent;
      this.qrcodeExpireTime = expireTime;
      this.setExpirationReminder();
    },
    /**
     * 设置过期提醒
     */
    setExpirationReminder() {
      if (this.expirationTimer) {
        clearTimeout(this.expirationTimer);
      }
      const now = Date.now();
      const timeToExpire = this.qrcodeExpireTime - now;
      if (timeToExpire <= 0) {
        this.generateQRCode();
        return;
      }
      const reminderTime = timeToExpire - 5 * 60 * 1e3;
      if (reminderTime > 0) {
        this.expirationTimer = setTimeout(() => {
          common_vendor.index.showToast({
            title: "二维码即将过期，请刷新",
            icon: "none",
            duration: 3e3
          });
        }, reminderTime);
      }
    },
    /**
     * 切换二维码显示/隐藏
     */
    toggleQRCode() {
      if (!this.showQRCode) {
        this.generateQRCode();
      }
      this.showQRCode = !this.showQRCode;
    }
  }
};
const _sfc_main = {
  components: {
    // fuiQrcode // 使用easycom后，不再需要手动注册
  },
  ...alumniCardPageJs,
  setup() {
    const navHeight = common_vendor.ref(44);
    const statusBarHeight = common_vendor.ref(0);
    const navbarInit = (e) => {
      statusBarHeight.value = e.statusBarHeight;
      navHeight.value = e.height + e.statusBarHeight;
    };
    return {
      navHeight,
      statusBarHeight,
      navbarInit
    };
  },
  methods: {
    ...alumniCardPageJs.methods,
    onQRCodeReady(e) {
      common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.vue:147", "QR Code ready:", e);
    }
  }
};
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_fui_col2 = common_vendor.resolveComponent("fui-col");
  const _easycom_fui_row2 = common_vendor.resolveComponent("fui-row");
  const _easycom_fui_qrcode2 = common_vendor.resolveComponent("fui-qrcode");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_fui_col2 + _easycom_fui_row2 + _easycom_fui_qrcode2)();
}
const _easycom_fui_icon = () => "../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_fui_col = () => "../../components/firstui/fui-col/fui-col.js";
const _easycom_fui_row = () => "../../components/firstui/fui-row/fui-row.js";
const _easycom_fui_qrcode = () => "../../components/firstui/fui-qrcode/fui-qrcode.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar + _easycom_fui_col + _easycom_fui_row + _easycom_fui_qrcode)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      name: "arrowleft",
      size: 48,
      color: _ctx.navTitleColor
    }),
    b: common_vendor.o($setup.navbarInit),
    c: common_vendor.o(_ctx.goBack),
    d: common_vendor.p({
      statusBar: true,
      title: "校友卡",
      background: _ctx.navBackground,
      color: _ctx.navTitleColor,
      size: 18,
      isFixed: true,
      fontWeight: 500
    }),
    e: common_assets._imports_0$1,
    f: common_vendor.p({
      span: 8
    }),
    g: common_vendor.t(_ctx.userInfo.name),
    h: common_vendor.p({
      span: 16
    }),
    i: common_vendor.p({
      ["margin-bottom"]: "16rpx"
    }),
    j: common_vendor.p({
      span: 8
    }),
    k: common_vendor.t(_ctx.userInfo.enrollmentYear),
    l: common_vendor.p({
      span: 16
    }),
    m: common_vendor.p({
      ["margin-bottom"]: "16rpx"
    }),
    n: common_vendor.p({
      span: 8
    }),
    o: common_vendor.t(_ctx.userInfo.educationType),
    p: common_vendor.p({
      span: 16
    }),
    q: common_vendor.p({
      ["margin-bottom"]: "16rpx"
    }),
    r: common_vendor.p({
      span: 8
    }),
    s: common_vendor.t(_ctx.userInfo.faculty),
    t: common_vendor.p({
      span: 16
    }),
    v: _ctx.userInfo.avatar || "/static/user-fill.svg",
    w: _ctx.showQRCode
  }, _ctx.showQRCode ? {
    x: common_vendor.o($options.onQRCodeReady),
    y: common_vendor.p({
      value: _ctx.qrcodeValue,
      width: 240,
      height: 240,
      foreground: "#004299",
      background: "#ffffff"
    })
  } : {}, {
    z: $setup.navHeight + "px",
    A: common_assets._imports_1$1,
    B: common_vendor.o((...args) => _ctx.toggleQRCode && _ctx.toggleQRCode(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/alumniCardPage/alumniCardPage.js.map

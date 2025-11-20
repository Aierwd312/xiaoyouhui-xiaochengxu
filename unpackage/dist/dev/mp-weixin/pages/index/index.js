"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_auth = require("../../utils/auth.js");
const common_assets = require("../../common/assets.js");
const indexJs = {
  data() {
    return {
      userName: store_index.store.state.user.name || "未登录",
      // 用户名
      isVerified: true,
      // 是否已认证
      notificationText: "最新福利通知：校友专享优惠活动开启",
      // 通知文本
      navBackground: "#004299",
      // 导航栏背景色 - 默认为主题色
      navTitleColor: "#000000",
      // 导航栏标题颜色 - 默认为黑色
      backgroundConfig: {
        backgroundType: "solid",
        // solid(纯色) | gradient(渐变) | image(图片)
        solidColor: "#004299",
        // 纯色背景的颜色 - 默认为主题色
        gradientFrom: "#004299",
        gradientTo: "#79A6DC",
        gradientMiddle: "#2A6DCF",
        gradientAngle: 135,
        imageUrl: "",
        blurAmount: 0,
        // 无模糊
        overlayOpacity: 0,
        // 无遮罩
        // 导航栏相关配置
        navBarConfig: {
          backgroundColor: "#004299",
          // 导航栏背景颜色 - 默认为主题色
          titleColor: "#000000",
          // 标题颜色 - 默认为黑色
          useGradient: false,
          // 不使用渐变背景
          gradientFrom: "#004299",
          gradientTo: "#2A6DCF",
          backgroundOpacity: 1
        }
      },
      // Helper to generate page URLs
      getPageUrl: (pageName) => `/pages/${pageName}/${pageName}`,
      functionsPersonal: [
        { id: 1, icon: "bank-card-2-line", text: "校友卡", pageName: "alumniCardPage", iconClass: "blue-icon", hasNotification: false },
        { id: 2, icon: "user-search-line", text: "发现校友", pageName: "discoverAlumniPage", iconClass: "dark-blue-icon", hasNotification: false },
        { id: 3, icon: "user-heart-line", text: "我的好友", pageName: "myFriendsPage", iconClass: "red-icon", hasNotification: true },
        { id: 4, icon: "team-line", text: "我的组织", pageName: "myOrganizationsPage", iconClass: "green-icon", hasNotification: false },
        { id: 5, icon: "profile-line", text: "学籍信息", pageName: "studentInfoPage", iconClass: "blue-icon", hasNotification: false },
        { id: 6, icon: "archive-line", text: "档案查询", pageName: "archiveQueryPage", iconClass: "light-blue-icon", hasNotification: false }
      ].map((item, index) => ({
        ID: item.id,
        CreatedAt: "2023-01-01T12:00:00+08:00",
        UpdatedAt: "2023-01-01T12:00:00+08:00",
        DeletedAt: null,
        type: "personal_function",
        name: item.text,
        icon: item.icon,
        url: `/pages/${item.pageName}/${item.pageName}`,
        parentId: 0,
        sort: index,
        status: 0,
        children: [],
        meta: {
          iconClass: item.iconClass,
          hasNotification: item.hasNotification,
          pageName: item.pageName
        }
      })),
      functionsSchool: [
        { id: 7, icon: "calendar-event-line", text: "母校活动", pageName: "schoolActivitiesPage", iconClass: "orange-icon", hasNotification: false },
        { id: 8, icon: "newspaper-line", text: "母校资讯", pageName: "schoolNewsPage", iconClass: "blue-icon", hasNotification: false },
        { id: 9, icon: "building-4-line", text: "进校预约", pageName: "campusAccessApplicationPage", iconClass: "dark-blue-icon", hasNotification: false },
        { id: 10, icon: "hand-heart-line", text: "回馈母校", pageName: "giveBackToSchoolPage", iconClass: "red-icon", hasNotification: false },
        { id: 11, icon: "briefcase-4-line", text: "校友服务", pageName: "alumniServicesPage", iconClass: "green-icon", hasNotification: false }
      ].map((item, index) => ({
        ID: item.id,
        CreatedAt: "2023-01-01T12:00:00+08:00",
        UpdatedAt: "2023-01-01T12:00:00+08:00",
        DeletedAt: null,
        type: "school_function",
        name: item.text,
        icon: item.icon,
        url: `/pages/${item.pageName}/${item.pageName}`,
        parentId: 0,
        sort: index,
        status: 0,
        children: [],
        meta: {
          iconClass: item.iconClass,
          hasNotification: item.hasNotification,
          pageName: item.pageName
        }
      })),
      functionsAccount: [
        { id: 12, icon: "user-settings-line", text: "账号管理", pageName: "mine", iconClass: "dark-blue-icon", hasNotification: false },
        { id: 13, icon: "feedback-line", text: "问题反馈", pageName: "feedbackPage", iconClass: "orange-icon", hasNotification: false },
        { id: 14, icon: "question-line", text: "系统帮助", pageName: "systemHelpPage", iconClass: "blue-icon", hasNotification: false }
      ].map((item, index) => ({
        ID: item.id,
        CreatedAt: "2023-01-01T12:00:00+08:00",
        UpdatedAt: "2023-01-01T12:00:00+08:00",
        DeletedAt: null,
        type: "account_function",
        name: item.text,
        icon: item.icon,
        url: item.pageName === "mine" ? `/pages/mine/index` : `/pages/${item.pageName}/${item.pageName}`,
        parentId: 0,
        sort: index,
        status: 0,
        children: [],
        meta: {
          iconClass: item.iconClass,
          hasNotification: item.hasNotification,
          pageName: item.pageName
        }
      }))
    };
  },
  onLoad() {
    this.checkLoginAndRedirect();
    this.applyBackgroundStyles();
    this.updateUserInfo();
  },
  onShow() {
    this.updateUserInfo();
  },
  mounted() {
    this.applyBackgroundStyles();
    setTimeout(() => {
      this.updateBackgroundConfig({
        backgroundType: "solid",
        solidColor: "#004299",
        // 与导航栏和内容区域背景一致
        blurAmount: 0,
        overlayOpacity: 0,
        navBarConfig: {
          backgroundColor: "#004299",
          titleColor: "#FFFFFF",
          // 导航栏标题黑色
          useGradient: false,
          backgroundOpacity: 1
        }
      });
    }, 2e3);
  },
  methods: {
    /**
     * 检查登录状态并重定向
     */
    checkLoginAndRedirect() {
      const token = utils_auth.getToken();
      if (!token) {
        common_vendor.index.__f__("log", "at pages/index/index.js:151", "首页检测到未登录，跳转到登录页");
        common_vendor.index.reLaunch({
          url: "/pages/login"
        });
        return false;
      }
      return true;
    },
    /**
     * 更新用户信息
     */
    updateUserInfo() {
      this.userName = store_index.store.state.user.name || "未登录";
      common_vendor.index.__f__("log", "at pages/index/index.js:166", "更新用户名:", this.userName);
    },
    /**
     * 点击通知栏
     */
    handleNotificationClick() {
      const url = this.getPageUrl("notificationsPage");
      common_vendor.index.navigateTo({ url });
      common_vendor.index.__f__("log", "at pages/index/index.js:175", `Navigating to: ${url}`);
    },
    /**
     * 点击个人资料
     */
    handleProfileClick() {
      const url = "/pages/mine/index";
      common_vendor.index.navigateTo({ url });
      common_vendor.index.__f__("log", "at pages/index/index.js:185", `Navigating to: ${url}`);
    },
    /**
     * 点击功能项
     * @param {Number} id 功能项ID
     * @param {String} name 功能项名称 (已改为使用ID查找URL)
     */
    handleFunctionClick(id, name) {
      let itemUrl = "";
      const allFunctions = [...this.functionsPersonal, ...this.functionsSchool, ...this.functionsAccount];
      const clickedItem = allFunctions.find((item) => item.ID === id);
      if (clickedItem && clickedItem.url) {
        itemUrl = clickedItem.url;
        common_vendor.index.navigateTo({ url: itemUrl });
        common_vendor.index.__f__("log", "at pages/index/index.js:202", `Navigating to function: ${name}, URL: ${itemUrl}`);
      } else {
        common_vendor.index.__f__("warn", "at pages/index/index.js:204", `No URL found for function ID: ${id}, Name: ${name}`);
        common_vendor.index.showToast({
          title: `功能"${name}"暂未开放`,
          icon: "none"
        });
      }
    },
    /**
     * 更新背景配置
     * @param {Object} config 背景配置
     */
    updateBackgroundConfig(config) {
      this.backgroundConfig = {
        ...this.backgroundConfig,
        ...config
      };
      this.applyBackgroundStyles();
    },
    /**
     * 应用背景样式
     */
    applyBackgroundStyles() {
      const cfg = this.backgroundConfig;
      if (cfg.backgroundType === "gradient") {
        `linear-gradient(${cfg.gradientAngle}deg, ${cfg.gradientFrom} 0%, ${cfg.gradientMiddle} 50%, ${cfg.gradientTo} 100%)`;
      } else if (cfg.backgroundType === "image" && cfg.imageUrl) {
        `url('${cfg.imageUrl}')`;
      } else if (cfg.backgroundType === "solid") {
        cfg.solidColor;
      }
      this.applyNavBarStyles();
      common_vendor.index.getSystemInfoSync();
      try {
        const pages = getCurrentPages();
        if (pages.length) {
          const currentPage = pages[pages.length - 1];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.js:272", "设置背景样式失败:", error);
      }
    },
    /**
     * 应用导航栏样式
     */
    applyNavBarStyles() {
      const navCfg = this.backgroundConfig.navBarConfig;
      if (navCfg.useGradient) {
        this.navBackground = `linear-gradient(90deg, ${navCfg.gradientFrom}, ${navCfg.gradientTo})`;
      } else {
        if (navCfg.backgroundColor === "transparent") {
          this.navBackground = "transparent";
        } else {
          const colorWithOpacity = this.hexToRgba(navCfg.backgroundColor, navCfg.backgroundOpacity);
          this.navBackground = colorWithOpacity;
        }
      }
      this.navTitleColor = navCfg.titleColor;
    },
    /**
     * 将HEX颜色转换为带透明度的RGBA
     * @param {String} hex 16进制颜色值
     * @param {Number} opacity 透明度 0-1
     * @returns {String} RGBA颜色值
     */
    hexToRgba(hex, opacity) {
      hex = hex.replace("#", "");
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  }
};
const _sfc_main = {
  components: {
    // fuiNavBar // 使用easycom后，不再需要手动注册
  },
  ...indexJs,
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
    ...indexJs.methods,
    getIconColorClass(iconClassFromMeta) {
      const colorMap = {
        "blue-icon": "svg-blue",
        "dark-blue-icon": "svg-darkblue",
        "red-icon": "svg-red",
        "green-icon": "svg-green",
        "gray-icon": "svg-gray",
        "light-blue-icon": "svg-lightblue",
        "orange-icon": "svg-orange"
      };
      return colorMap[iconClassFromMeta] || "svg-darkblue";
    }
  }
};
if (!Array) {
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  _easycom_fui_nav_bar2();
}
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
if (!Math) {
  _easycom_fui_nav_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($setup.navbarInit),
    b: common_vendor.p({
      statusBar: true,
      title: "重财校友会",
      background: _ctx.navBackground,
      color: _ctx.navTitleColor,
      size: 18,
      isFixed: true,
      fontWeight: 500
    }),
    c: common_assets._imports_0,
    d: common_vendor.t(_ctx.notificationText),
    e: common_assets._imports_3,
    f: common_vendor.o((...args) => _ctx.handleNotificationClick && _ctx.handleNotificationClick(...args)),
    g: $setup.navHeight + "px",
    h: common_assets._imports_2,
    i: common_vendor.t(_ctx.userName),
    j: _ctx.isVerified
  }, _ctx.isVerified ? {} : {}, {
    k: common_assets._imports_3,
    l: common_vendor.o((...args) => _ctx.handleProfileClick && _ctx.handleProfileClick(...args)),
    m: common_vendor.f(_ctx.functionsPersonal, (item, index, i0) => {
      return common_vendor.e({
        a: "/static/" + item.icon + ".svg",
        b: common_vendor.n($options.getIconColorClass(item.meta.iconClass)),
        c: common_vendor.n(item.meta.iconClass),
        d: common_vendor.t(item.name),
        e: item.meta.hasNotification ? 1 : "",
        f: common_vendor.o(($event) => _ctx.handleFunctionClick(item.ID, item.name), item.ID),
        g: index !== _ctx.functionsPersonal.length - 1
      }, index !== _ctx.functionsPersonal.length - 1 ? {} : {}, {
        h: item.ID
      });
    }),
    n: common_assets._imports_3,
    o: common_vendor.f(_ctx.functionsSchool, (item, index, i0) => {
      return common_vendor.e({
        a: "/static/" + item.icon + ".svg",
        b: common_vendor.n($options.getIconColorClass(item.meta.iconClass)),
        c: common_vendor.n(item.meta.iconClass),
        d: common_vendor.t(item.name),
        e: item.meta.hasNotification ? 1 : "",
        f: common_vendor.o(($event) => _ctx.handleFunctionClick(item.ID, item.name), item.ID),
        g: index !== _ctx.functionsSchool.length - 1
      }, index !== _ctx.functionsSchool.length - 1 ? {} : {}, {
        h: item.ID
      });
    }),
    p: common_assets._imports_3,
    q: common_vendor.f(_ctx.functionsAccount, (item, index, i0) => {
      return common_vendor.e({
        a: "/static/" + item.icon + ".svg",
        b: common_vendor.n($options.getIconColorClass(item.meta.iconClass)),
        c: common_vendor.n(item.meta.iconClass),
        d: common_vendor.t(item.name),
        e: item.meta.hasNotification ? 1 : "",
        f: common_vendor.o(($event) => _ctx.handleFunctionClick(item.ID, item.name), item.ID),
        g: index !== _ctx.functionsAccount.length - 1
      }, index !== _ctx.functionsAccount.length - 1 ? {} : {}, {
        h: item.ID
      });
    }),
    r: common_assets._imports_3
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map

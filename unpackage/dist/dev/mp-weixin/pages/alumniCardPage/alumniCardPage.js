"use strict";
const common_vendor = require("../../common/vendor.js");
const api_alumniCard = require("../../api/alumniCard.js");
const utils_common = require("../../utils/common.js");
const store_index = require("../../store/index.js");
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
        name: "",
        // 用户姓名
        enrollmentYear: "",
        // 入学年份
        educationType: "",
        // 入学类型：本科、专升本等
        faculty: "",
        // 院系
        avatar: ""
        // 头像URL，为空则使用默认头像
      },
      // 二维码数据
      qrcodeValue: "",
      // 二维码内容
      qrcodeExpireTime: 0,
      // 二维码过期时间戳
      qrcodeRefreshTimer: null,
      // 二维码刷新定时器
      // 是否显示二维码
      showQRCode: false,
      // 加载状态
      loading: false,
      // 测试模式 - 用于调试，实际部署时应设为false
      testMode: true
    };
  },
  onLoad() {
    this.loadUserInfo();
  },
  onUnload() {
    if (this.qrcodeRefreshTimer) {
      clearTimeout(this.qrcodeRefreshTimer);
    }
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
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
     * 加载用户信息
     */
    async loadUserInfo() {
      let loadingShown = false;
      try {
        common_vendor.index.showLoading({
          title: "加载中..."
        });
        loadingShown = true;
        common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:70", "开始获取用户校友信息...");
        if (this.testMode) {
          common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:74", "测试模式：使用模拟用户信息");
          const nickName2 = store_index.store.state.user.nickName || "校友";
          const mockUserInfo = {
            code: 200,
            data: {
              enrollmentYear: "2020",
              educationType: "本科",
              faculty: "计算机学院",
              avatar: ""
            },
            msg: "获取成功"
          };
          await new Promise((resolve) => setTimeout(resolve, 500));
          common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:91", "模拟用户信息响应:", mockUserInfo);
          if (mockUserInfo.code === 200 && mockUserInfo.data) {
            this.userInfo = {
              name: nickName2,
              enrollmentYear: mockUserInfo.data.enrollmentYear || "",
              educationType: mockUserInfo.data.educationType || "",
              faculty: mockUserInfo.data.faculty || "",
              avatar: mockUserInfo.data.avatar || ""
            };
            common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:101", "用户信息加载成功:", this.userInfo);
            return;
          }
        }
        const nickName = store_index.store.state.user.nickName || "校友";
        const userInfoRes = await api_alumniCard.getAlumniInfo();
        common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:112", "用户信息API响应:", userInfoRes);
        if (userInfoRes && userInfoRes.code === 200 && userInfoRes.data) {
          this.userInfo = {
            name: nickName,
            enrollmentYear: userInfoRes.data.enrollmentYear || "",
            educationType: userInfoRes.data.educationType || "",
            faculty: userInfoRes.data.faculty || "",
            avatar: userInfoRes.data.avatar || ""
          };
          common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:122", "用户信息加载成功:", this.userInfo);
        } else {
          common_vendor.index.__f__("warn", "at pages/alumniCardPage/alumniCardPage.js:124", "用户信息API返回异常，使用默认值");
          this.userInfo = {
            name: nickName,
            enrollmentYear: "未知",
            educationType: "未知",
            faculty: "未知",
            avatar: ""
          };
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/alumniCardPage/alumniCardPage.js:135", "获取用户信息失败:", error);
        const nickName = store_index.store.state.user.nickName || "校友";
        this.userInfo = {
          name: nickName,
          enrollmentYear: "未知",
          educationType: "未知",
          faculty: "未知",
          avatar: ""
        };
      } finally {
        if (loadingShown) {
          common_vendor.index.hideLoading();
        }
      }
    },
    /**
     * 生成二维码
     */
    async generateQRCode() {
      if (this.loading)
        return;
      this.loading = true;
      let loadingShown = false;
      try {
        common_vendor.index.showLoading({
          title: "生成二维码中..."
        });
        loadingShown = true;
        common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:168", "开始调用二维码生成API...");
        if (this.testMode) {
          common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:172", "测试模式：使用模拟二维码数据");
          const mockResponse = {
            code: 200,
            data: {
              qrcode: `ALUMNI_CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            },
            msg: "生成成功"
          };
          await new Promise((resolve) => setTimeout(resolve, 1e3));
          common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:184", "模拟API响应:", mockResponse);
          if (mockResponse.code === 200 && mockResponse.data && mockResponse.data.qrcode) {
            this.qrcodeValue = mockResponse.data.qrcode;
            const expireTime = Date.now() + 30 * 60 * 1e3;
            this.qrcodeExpireTime = expireTime;
            this.setExpirationReminder();
            this.setAutoRefresh();
            common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:199", "二维码生成成功:", this.qrcodeValue);
            utils_common.toast("二维码生成成功");
            return;
          }
        }
        const response = await api_alumniCard.generateQRCode();
        common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:208", "API响应:", response);
        if (typeof response === "string" && response.includes("RuoYi")) {
          throw new Error("API返回了欢迎页面，请检查API地址和端口配置");
        }
        if (response && response.code === 200) {
          let qrcodeData = "";
          if (response.data) {
            qrcodeData = response.data.qrcode || response.data.qrcodeValue || response.data;
          } else {
            qrcodeData = response.qrcode || response.qrcodeValue || "";
          }
          if (qrcodeData && typeof qrcodeData === "string") {
            this.qrcodeValue = qrcodeData;
            const expireTime = Date.now() + 30 * 60 * 1e3;
            this.qrcodeExpireTime = expireTime;
            this.setExpirationReminder();
            this.setAutoRefresh();
            common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:237", "二维码生成成功:", qrcodeData);
            utils_common.toast("二维码生成成功");
          } else {
            throw new Error("服务器返回的二维码数据格式不正确");
          }
        } else {
          const errorMsg = response ? response.msg || response.message || "生成二维码失败" : "服务器无响应";
          throw new Error(errorMsg);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/alumniCardPage/alumniCardPage.js:247", "生成二维码失败:", error);
        let errorMessage = "生成二维码失败";
        if (error.message) {
          if (error.message.includes("timeout")) {
            errorMessage = "请求超时，请检查网络连接";
          } else if (error.message.includes("Network Error")) {
            errorMessage = "网络连接失败，请检查网络设置";
          } else if (error.message.includes("500")) {
            errorMessage = "服务器内部错误，请稍后重试";
          } else if (error.message.includes("401")) {
            errorMessage = "身份验证失败，请重新登录";
          } else {
            errorMessage = error.message;
          }
        }
        utils_common.toast(errorMessage);
        this.qrcodeValue = "";
      } finally {
        this.loading = false;
        if (loadingShown) {
          common_vendor.index.hideLoading();
        }
      }
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
     * 设置自动刷新
     */
    setAutoRefresh() {
      if (this.qrcodeRefreshTimer) {
        clearTimeout(this.qrcodeRefreshTimer);
      }
      this.qrcodeRefreshTimer = setTimeout(() => {
        if (this.showQRCode) {
          this.generateQRCode();
        }
      }, 25 * 60 * 1e3);
    },
    /**
     * 切换二维码显示/隐藏
     */
    toggleQRCode() {
      if (!this.showQRCode) {
        this.generateQRCode();
      }
      this.showQRCode = !this.showQRCode;
    },
    /**
     * 切换测试模式
     */
    toggleTestMode() {
      this.testMode = !this.testMode;
      utils_common.toast(`测试模式已${this.testMode ? "开启" : "关闭"}`);
      common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:342", "测试模式:", this.testMode ? "开启" : "关闭");
    },
    /**
     * 测试API连接
     */
    async testAPIConnection() {
      try {
        common_vendor.index.showLoading({
          title: "测试API连接..."
        });
        common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:354", "开始测试API连接...");
        common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:355", "API地址: http://10.155.10.148:8082/core/studentInfo/QRCode");
        const response = await api_alumniCard.generateQRCode();
        common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.js:360", "API测试响应:", response);
        if (response) {
          if (typeof response === "string") {
            if (response.includes("RuoYi")) {
              utils_common.toast("API返回了RuoYi欢迎页面，请检查API路径");
            } else {
              utils_common.toast("API返回了字符串数据");
            }
          } else if (response.code === 200) {
            utils_common.toast("API连接成功！");
          } else {
            utils_common.toast(`API返回错误码: ${response.code}`);
          }
        } else {
          utils_common.toast("API无响应");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/alumniCardPage/alumniCardPage.js:378", "API测试失败:", error);
        utils_common.toast(`API测试失败: ${error.message}`);
      } finally {
        common_vendor.index.hideLoading();
      }
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
      common_vendor.index.__f__("log", "at pages/alumniCardPage/alumniCardPage.vue:179", "QR Code ready:", e);
    }
  }
};
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_fui_col2 = common_vendor.resolveComponent("fui-col");
  const _easycom_fui_row2 = common_vendor.resolveComponent("fui-row");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_fui_qrcode2 = common_vendor.resolveComponent("fui-qrcode");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_fui_col2 + _easycom_fui_row2 + _easycom_uni_load_more2 + _easycom_fui_qrcode2)();
}
const _easycom_fui_icon = () => "../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_fui_col = () => "../../components/firstui/fui-col/fui-col.js";
const _easycom_fui_row = () => "../../components/firstui/fui-row/fui-row.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_fui_qrcode = () => "../../components/firstui/fui-qrcode/fui-qrcode.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar + _easycom_fui_col + _easycom_fui_row + _easycom_uni_load_more + _easycom_fui_qrcode)();
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
    d: common_vendor.o(_ctx.toggleTestMode),
    e: common_vendor.p({
      statusBar: true,
      title: "校友卡",
      background: _ctx.navBackground,
      color: _ctx.navTitleColor,
      size: 18,
      isFixed: true,
      fontWeight: 500
    }),
    f: common_assets._imports_0$2,
    g: common_vendor.p({
      span: 8
    }),
    h: common_vendor.t(_ctx.userInfo.name),
    i: common_vendor.p({
      span: 16
    }),
    j: common_vendor.p({
      ["margin-bottom"]: "16rpx"
    }),
    k: common_vendor.p({
      span: 8
    }),
    l: common_vendor.t(_ctx.userInfo.enrollmentYear),
    m: common_vendor.p({
      span: 16
    }),
    n: common_vendor.p({
      ["margin-bottom"]: "16rpx"
    }),
    o: common_vendor.p({
      span: 8
    }),
    p: common_vendor.t(_ctx.userInfo.educationType),
    q: common_vendor.p({
      span: 16
    }),
    r: common_vendor.p({
      ["margin-bottom"]: "16rpx"
    }),
    s: common_vendor.p({
      span: 8
    }),
    t: common_vendor.t(_ctx.userInfo.faculty),
    v: common_vendor.p({
      span: 16
    }),
    w: _ctx.userInfo.avatar || "/static/user-fill.svg",
    x: _ctx.showQRCode
  }, _ctx.showQRCode ? common_vendor.e({
    y: _ctx.loading
  }, _ctx.loading ? {
    z: common_vendor.p({
      status: "loading",
      ["content-text"]: {
        contentdown: "生成中...",
        contentrefresh: "生成中...",
        contentnomore: "生成中..."
      }
    })
  } : _ctx.qrcodeValue ? {
    B: common_vendor.o($options.onQRCodeReady),
    C: common_vendor.p({
      value: _ctx.qrcodeValue,
      width: 240,
      height: 240,
      foreground: "#004299",
      background: "#ffffff"
    })
  } : {
    D: common_vendor.o((...args) => _ctx.generateQRCode && _ctx.generateQRCode(...args))
  }, {
    A: _ctx.qrcodeValue,
    E: common_assets._imports_2$1,
    F: common_vendor.t(_ctx.loading ? "生成中..." : "刷新"),
    G: common_vendor.o((...args) => _ctx.generateQRCode && _ctx.generateQRCode(...args)),
    H: _ctx.loading ? 1 : ""
  }) : {}, {
    I: $setup.navHeight + "px",
    J: _ctx.testMode
  }, _ctx.testMode ? {
    K: common_vendor.o((...args) => _ctx.testAPIConnection && _ctx.testAPIConnection(...args)),
    L: common_vendor.o((...args) => _ctx.toggleTestMode && _ctx.toggleTestMode(...args))
  } : {}, {
    M: common_assets._imports_2,
    N: common_vendor.o((...args) => _ctx.toggleQRCode && _ctx.toggleQRCode(...args)),
    O: _ctx.testMode
  }, _ctx.testMode ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/alumniCardPage/alumniCardPage.js.map

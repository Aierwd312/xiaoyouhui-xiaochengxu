"use strict";
const common_vendor = require("../../common/vendor.js");
const api_news = require("../../api/news.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      navHeight: 44,
      newsId: "",
      newsDetail: null,
      loading: false
    };
  },
  onLoad(options) {
    if (options.id) {
      this.newsId = options.id;
      this.loadNewsDetail();
    }
  },
  methods: {
    // 导航栏初始化
    navbarInit(e) {
      this.navHeight = e.height + e.statusBarHeight;
    },
    // 加载新闻详情
    async loadNewsDetail() {
      if (!this.newsId) {
        common_vendor.index.__f__("error", "at pages/newsDetailPage/newsDetailPage.vue:121", "新闻ID为空，无法加载详情");
        common_vendor.index.showToast({
          title: "新闻ID无效",
          icon: "none"
        });
        return;
      }
      this.loading = true;
      common_vendor.index.__f__("log", "at pages/newsDetailPage/newsDetailPage.vue:130", "开始加载新闻详情，ID:", this.newsId);
      try {
        const response = await api_news.getNewsDetail(this.newsId);
        common_vendor.index.__f__("log", "at pages/newsDetailPage/newsDetailPage.vue:134", "新闻详情API响应:", response);
        if (response && response.code === 200) {
          this.newsDetail = response.data || response;
          common_vendor.index.__f__("log", "at pages/newsDetailPage/newsDetailPage.vue:139", "新闻详情加载成功:", this.newsDetail);
        } else {
          common_vendor.index.__f__("error", "at pages/newsDetailPage/newsDetailPage.vue:141", "获取新闻详情失败，响应:", response);
          common_vendor.index.showToast({
            title: (response == null ? void 0 : response.msg) || "获取新闻详情失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/newsDetailPage/newsDetailPage.vue:148", "加载新闻详情异常:", error);
        common_vendor.index.__f__("error", "at pages/newsDetailPage/newsDetailPage.vue:149", "错误详情:", {
          message: error.message,
          stack: error.stack,
          newsId: this.newsId
        });
        let errorMessage = "网络错误，请稍后重试";
        if (error.message && error.message.includes("timeout")) {
          errorMessage = "请求超时，请检查网络连接";
        } else if (error.message && error.message.includes("Network Error")) {
          errorMessage = "网络连接失败，请检查网络设置";
        }
        common_vendor.index.showToast({
          title: errorMessage,
          icon: "none",
          duration: 3e3
        });
      } finally {
        this.loading = false;
      }
    },
    // 打开链接
    openUrl(url) {
      if (!url)
        return;
      common_vendor.index.__f__("log", "at pages/newsDetailPage/newsDetailPage.vue:176", "打开链接:", url);
      if (url.includes("mp.weixin.qq.com")) {
        common_vendor.index.showModal({
          title: "查看原文",
          content: "由于微信限制，无法在小程序中直接打开公众号文章。是否复制链接，您可以在微信中打开？",
          confirmText: "复制链接",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.setClipboardData({
                data: url,
                success: () => {
                  common_vendor.index.showToast({
                    title: "链接已复制到剪贴板",
                    icon: "success",
                    duration: 2e3
                  });
                  setTimeout(() => {
                    common_vendor.index.showModal({
                      title: "使用提示",
                      content: '请在微信聊天界面长按输入框，选择"粘贴"即可打开文章',
                      showCancel: false,
                      confirmText: "知道了"
                    });
                  }, 2500);
                },
                fail: () => {
                  common_vendor.index.showToast({
                    title: "复制失败",
                    icon: "none"
                  });
                }
              });
            }
          }
        });
      } else {
        common_vendor.index.navigateTo({
          url: `/pages/common/webview/index?url=${encodeURIComponent(url)}`,
          success: () => {
            common_vendor.index.__f__("log", "at pages/newsDetailPage/newsDetailPage.vue:222", "webview页面跳转成功");
          },
          fail: (error) => {
            common_vendor.index.__f__("error", "at pages/newsDetailPage/newsDetailPage.vue:225", "webview页面跳转失败:", error);
            common_vendor.index.showModal({
              title: "提示",
              content: "无法打开网页，是否复制链接到剪贴板？",
              success: (res) => {
                if (res.confirm) {
                  common_vendor.index.setClipboardData({
                    data: url,
                    success: () => {
                      common_vendor.index.showToast({
                        title: "链接已复制",
                        icon: "success"
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    },
    // 分享新闻
    handleShare() {
      if (!this.newsDetail)
        return;
      common_vendor.index.share({
        provider: "weixin",
        scene: "WXSceneSession",
        type: 0,
        href: this.newsDetail.url || "",
        title: this.newsDetail.title || "",
        summary: this.newsDetail.remark || "",
        imageUrl: this.newsDetail.backgroundImage || "",
        success: function(res) {
          common_vendor.index.showToast({
            title: "分享成功",
            icon: "success"
          });
        },
        fail: function(err) {
          common_vendor.index.showToast({
            title: "分享失败",
            icon: "none"
          });
        }
      });
    },
    // 返回上一页
    handleBack() {
      common_vendor.index.navigateBack();
    },
    // 格式化时间
    formatTime(timeString) {
      if (!timeString)
        return "";
      const date = new Date(timeString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    // 处理图片URL
    getImageUrl(imagePath) {
      if (!imagePath)
        return "";
      if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
      }
      const baseUrl = "http://10.155.10.148:8090";
      return baseUrl + imagePath;
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
    a: common_vendor.o($options.navbarInit),
    b: common_vendor.p({
      statusBar: true,
      title: "新闻详情",
      background: "#004299",
      color: "#FFFFFF",
      size: 18,
      isFixed: true,
      fontWeight: 500
    }),
    c: $data.loading
  }, $data.loading ? {} : {}, {
    d: !$data.loading && $data.newsDetail
  }, !$data.loading && $data.newsDetail ? common_vendor.e({
    e: common_vendor.t($data.newsDetail.title),
    f: common_vendor.t($options.formatTime($data.newsDetail.createTime)),
    g: $data.newsDetail.createBy
  }, $data.newsDetail.createBy ? {
    h: common_vendor.t($data.newsDetail.createBy)
  } : {}, {
    i: $data.newsDetail.updateTime && $data.newsDetail.updateTime !== $data.newsDetail.createTime
  }, $data.newsDetail.updateTime && $data.newsDetail.updateTime !== $data.newsDetail.createTime ? {
    j: common_vendor.t($options.formatTime($data.newsDetail.updateTime))
  } : {}, {
    k: $data.newsDetail.backgroundImage
  }, $data.newsDetail.backgroundImage ? {
    l: $options.getImageUrl($data.newsDetail.backgroundImage)
  } : {}, {
    m: $data.newsDetail.remark
  }, $data.newsDetail.remark ? {
    n: common_vendor.t($data.newsDetail.remark)
  } : {}, {
    o: $data.newsDetail.url
  }, $data.newsDetail.url ? common_vendor.e({
    p: common_assets._imports_0$3,
    q: common_vendor.t($data.newsDetail.url.includes("mp.weixin.qq.com") ? "查看微信原文" : "查看原文"),
    r: $data.newsDetail.url.includes("mp.weixin.qq.com")
  }, $data.newsDetail.url.includes("mp.weixin.qq.com") ? {} : {}, {
    s: common_vendor.o(($event) => $options.openUrl($data.newsDetail.url))
  }) : {}, {
    t: common_assets._imports_1$1,
    v: common_vendor.o((...args) => $options.handleShare && $options.handleShare(...args)),
    w: common_assets._imports_2$3,
    x: common_vendor.o((...args) => $options.handleBack && $options.handleBack(...args))
  }) : {}, {
    y: !$data.loading && !$data.newsDetail
  }, !$data.loading && !$data.newsDetail ? {
    z: common_assets._imports_3$1,
    A: common_vendor.o((...args) => $options.loadNewsDetail && $options.loadNewsDetail(...args))
  } : {}, {
    B: $data.navHeight + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f3347aa7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/newsDetailPage/newsDetailPage.js.map

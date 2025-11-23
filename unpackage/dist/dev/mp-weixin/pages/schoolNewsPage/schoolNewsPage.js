"use strict";
const common_vendor = require("../../common/vendor.js");
const api_news = require("../../api/news.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      navHeight: 44,
      searchTitle: "",
      newsList: [],
      loading: false,
      hasMore: true,
      pageNum: 1,
      pageSize: 10,
      total: 0
    };
  },
  onLoad() {
    this.loadNewsList();
  },
  onShow() {
    this.handleRefresh();
  },
  methods: {
    // 导航栏初始化
    navbarInit(e) {
      this.navHeight = e.height + e.statusBarHeight;
    },
    // 加载新闻列表
    async loadNewsList(isLoadMore = false) {
      if (this.loading)
        return;
      this.loading = true;
      try {
        const params = {
          pageNum: isLoadMore ? this.pageNum : 1,
          pageSize: this.pageSize,
          title: this.searchTitle
        };
        const response = await api_news.getNewsList(params);
        common_vendor.index.__f__("log", "at pages/schoolNewsPage/schoolNewsPage.vue:133", "API响应数据:", response);
        if (response.code === 200) {
          let newsData = [];
          let totalCount = 0;
          if (response.rows) {
            newsData = response.rows;
            totalCount = response.total || 0;
          } else if (response.data) {
            if (response.data.rows) {
              newsData = response.data.rows;
              totalCount = response.data.total || 0;
            } else if (Array.isArray(response.data)) {
              newsData = response.data;
              totalCount = response.data.length;
            } else {
              newsData = [response.data];
              totalCount = 1;
            }
          }
          if (isLoadMore) {
            this.newsList = [...this.newsList, ...newsData];
          } else {
            this.newsList = newsData;
            this.pageNum = 1;
          }
          this.total = totalCount;
          this.hasMore = this.newsList.length < totalCount;
          if (isLoadMore) {
            this.pageNum++;
          }
        } else {
          common_vendor.index.showToast({
            title: response.msg || "获取新闻列表失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/schoolNewsPage/schoolNewsPage.vue:178", "加载新闻列表失败:", error);
        common_vendor.index.__f__("error", "at pages/schoolNewsPage/schoolNewsPage.vue:179", "错误详情:", {
          message: error.message,
          stack: error.stack,
          params: {
            pageNum: isLoadMore ? this.pageNum : 1,
            pageSize: this.pageSize,
            title: this.searchTitle
          }
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
    // 搜索新闻
    handleSearch() {
      this.pageNum = 1;
      this.hasMore = true;
      this.loadNewsList();
    },
    // 刷新数据
    handleRefresh() {
      this.pageNum = 1;
      this.hasMore = true;
      this.loadNewsList();
    },
    // 加载更多
    loadMore() {
      if (this.hasMore && !this.loading) {
        this.loadNewsList(true);
      }
    },
    // 点击新闻项
    handleNewsClick(newsItem) {
      common_vendor.index.__f__("log", "at pages/schoolNewsPage/schoolNewsPage.vue:230", "点击新闻项:", newsItem);
      if (!newsItem || !newsItem.id) {
        common_vendor.index.__f__("error", "at pages/schoolNewsPage/schoolNewsPage.vue:233", "新闻项数据无效:", newsItem);
        common_vendor.index.showToast({
          title: "新闻数据无效",
          icon: "none"
        });
        return;
      }
      const detailUrl = `/pages/newsDetailPage/newsDetailPage?id=${newsItem.id}`;
      common_vendor.index.__f__("log", "at pages/schoolNewsPage/schoolNewsPage.vue:242", "跳转到新闻详情页面:", detailUrl);
      common_vendor.index.navigateTo({
        url: detailUrl,
        success: () => {
          common_vendor.index.__f__("log", "at pages/schoolNewsPage/schoolNewsPage.vue:248", "页面跳转成功");
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/schoolNewsPage/schoolNewsPage.vue:251", "页面跳转失败:", error);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    },
    // 导出新闻列表
    async handleExportNews() {
      var _a;
      let params = null;
      try {
        common_vendor.index.showLoading({
          title: "正在导出..."
        });
        params = {};
        if (this.searchTitle && this.searchTitle.trim()) {
          params.title = this.searchTitle.trim();
        }
        common_vendor.index.__f__("log", "at pages/schoolNewsPage/schoolNewsPage.vue:277", "导出参数:", params);
        common_vendor.index.__f__("log", "at pages/schoolNewsPage/schoolNewsPage.vue:278", "完整导出URL:", `${((_a = this.$config) == null ? void 0 : _a.baseUrl) || "http://10.155.10.148:8090/prod-api"}/core/news/export`);
        const response = await api_news.exportNewsList(params);
        common_vendor.index.__f__("log", "at pages/schoolNewsPage/schoolNewsPage.vue:281", "导出API响应:", response);
        if (typeof response === "string" && (response.startsWith("PK") || response.includes("xlsx") || response.includes("xls"))) {
          common_vendor.index.showToast({
            title: "导出成功，文件已生成",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.showModal({
              title: "导出完成",
              content: "新闻列表已成功导出。由于小程序限制，请联系管理员获取导出文件。",
              showCancel: false,
              confirmText: "知道了"
            });
          }, 1500);
          common_vendor.index.__f__("log", "at pages/schoolNewsPage/schoolNewsPage.vue:301", "导出文件数据长度:", response.length);
        } else if (response && response.code === 200) {
          common_vendor.index.showToast({
            title: "导出成功",
            icon: "success"
          });
          common_vendor.index.__f__("log", "at pages/schoolNewsPage/schoolNewsPage.vue:307", "导出数据:", response.data);
        } else {
          common_vendor.index.__f__("error", "at pages/schoolNewsPage/schoolNewsPage.vue:309", "导出失败，响应:", response);
          common_vendor.index.showToast({
            title: (response == null ? void 0 : response.msg) || "导出失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/schoolNewsPage/schoolNewsPage.vue:316", "导出新闻列表异常:", error);
        common_vendor.index.__f__("error", "at pages/schoolNewsPage/schoolNewsPage.vue:317", "错误详情:", {
          message: error.message,
          stack: error.stack,
          params,
          apiUrl: "/core/news/export"
        });
        let errorMessage = "导出失败，请稍后重试";
        if (error === "500" || error.message && error.message.includes("500")) {
          errorMessage = "服务器内部错误，可能是路由配置问题";
        } else if (error.message && error.message.includes("timeout")) {
          errorMessage = "导出超时，请稍后重试";
        } else if (error.message && error.message.includes("Long")) {
          errorMessage = "后端接口参数类型错误，请联系管理员";
        }
        common_vendor.index.showToast({
          title: errorMessage,
          icon: "none",
          duration: 3e3
        });
      } finally {
        common_vendor.index.hideLoading();
      }
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
      title: "母校资讯",
      background: "#004299",
      color: "#FFFFFF",
      size: 18,
      isFixed: true,
      fontWeight: 500
    }),
    c: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    d: $data.searchTitle,
    e: common_vendor.o(($event) => $data.searchTitle = $event.detail.value),
    f: common_assets._imports_0$3,
    g: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    h: common_assets._imports_1$1,
    i: common_vendor.o((...args) => $options.handleExportNews && $options.handleExportNews(...args)),
    j: common_assets._imports_2$1,
    k: common_vendor.o((...args) => $options.handleRefresh && $options.handleRefresh(...args)),
    l: common_vendor.f($data.newsList, (item, index, i0) => {
      return common_vendor.e({
        a: item.backgroundImage
      }, item.backgroundImage ? {
        b: $options.getImageUrl(item.backgroundImage)
      } : {}, {
        c: common_vendor.t(item.title),
        d: common_vendor.t($options.formatTime(item.createTime)),
        e: item.createBy
      }, item.createBy ? {
        f: common_vendor.t(item.createBy)
      } : {}, {
        g: item.remark
      }, item.remark ? {
        h: common_vendor.t(item.remark)
      } : {}, {
        i: !item.backgroundImage ? 1 : "",
        j: item.id,
        k: common_vendor.o(($event) => $options.handleNewsClick(item), item.id)
      });
    }),
    m: common_assets._imports_3,
    n: $data.hasMore && !$data.loading
  }, $data.hasMore && !$data.loading ? {
    o: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {}, {
    p: $data.loading
  }, $data.loading ? {} : {}, {
    q: !$data.loading && $data.newsList.length === 0
  }, !$data.loading && $data.newsList.length === 0 ? {
    r: common_assets._imports_4
  } : {}, {
    s: $data.navHeight + "px"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-56cc0985"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/schoolNewsPage/schoolNewsPage.js.map

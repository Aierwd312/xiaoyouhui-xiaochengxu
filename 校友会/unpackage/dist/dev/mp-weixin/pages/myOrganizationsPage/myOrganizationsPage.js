"use strict";
const common_vendor = require("../../common/vendor.js");
const mockJoinedOrganizations = [
  {
    id: "1",
    name: "重庆财经校友总会",
    type: "校友总会",
    logoUrl: "/static/images/org_logo_default.png",
    qrCodeUrl: "https://doc.firstui.cn"
  },
  {
    id: "2",
    name: "北京校友分会",
    type: "地方分会",
    logoUrl: "/static/images/org_logo_default.png",
    qrCodeUrl: "https://doc.firstui.cn"
  },
  {
    id: "3",
    name: "经济学院校友会",
    type: "院系分会",
    logoUrl: "/static/images/org_logo_default.png",
    qrCodeUrl: "https://doc.firstui.cn"
  }
];
const mockDiscoverableOrganizations = {
  total: 20,
  data: [
    {
      id: "4",
      name: "上海校友分会",
      type: "地方分会",
      description: "覆盖上海地区的校友联络与活动组织",
      logoUrl: "/static/images/org_logo_default.png",
      status: "joinable"
    },
    {
      id: "5",
      name: "深圳校友分会",
      type: "地方分会",
      description: "覆盖深圳地区的校友联络与活动组织",
      logoUrl: "/static/images/org_logo_default.png",
      status: "pending"
    },
    {
      id: "6",
      name: "金融学院校友会",
      type: "院系分会",
      description: "金融学院毕业生校友交流平台",
      logoUrl: "/static/images/org_logo_default.png",
      status: "joinable"
    },
    {
      id: "7",
      name: "会计学院校友会",
      type: "院系分会",
      description: "会计学院校友互助平台",
      logoUrl: "/static/images/org_logo_default.png",
      status: "joinable"
    },
    {
      id: "8",
      name: "会计师校友分会",
      type: "专业分会",
      description: "从事会计行业校友的交流平台",
      logoUrl: "/static/images/org_logo_default.png",
      status: "joinable"
    }
  ]
};
const getMyJoinedOrganizations = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(mockJoinedOrganizations);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/myOrganizationsPage/myOrganizationsPage.js:87", "获取已加入组织列表失败:", error);
        reject(error);
      }
    }, 500);
  });
};
const getDiscoverableOrganizations = ({ page = 1, limit = 10, keyword = "", category = "" }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let filteredData = [...mockDiscoverableOrganizations.data];
        if (keyword) {
          filteredData = filteredData.filter(
            (org) => org.name.includes(keyword) || org.type.includes(keyword) || org.description && org.description.includes(keyword)
          );
        }
        if (category) {
          const categoryMap = {
            "main": "校友总会",
            "local": "地方分会",
            "college": "院系分会",
            "major": "专业分会"
          };
          filteredData = filteredData.filter((org) => org.type === categoryMap[category]);
        }
        const startIdx = (page - 1) * limit;
        const endIdx = page * limit;
        const pageData = filteredData.slice(startIdx, endIdx);
        resolve({
          total: filteredData.length,
          data: pageData
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/myOrganizationsPage/myOrganizationsPage.js:141", "获取可发现组织列表失败:", error);
        reject(error);
      }
    }, 500);
  });
};
const requestToJoinOrganization = (organizationId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve({
          success: true,
          message: "申请已提交",
          status: "pending"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/myOrganizationsPage/myOrganizationsPage.js:165", "申请加入组织失败:", error);
        reject(error);
      }
    }, 800);
  });
};
const saveImageToPhotosAlbum = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const settingRes = await common_vendor.index.getSetting();
      if (!settingRes.authSetting["scope.writePhotosAlbum"]) {
        await common_vendor.index.authorize({ scope: "scope.writePhotosAlbum" }).catch((err) => {
          common_vendor.index.showModal({
            title: "提示",
            content: "需要您授权保存图片到相册",
            success: (res) => {
              if (res.confirm) {
                common_vendor.index.openSetting();
              }
            }
          });
          throw new Error("未授权保存图片");
        });
      }
      let localPath = url;
      if (url.startsWith("http")) {
        common_vendor.index.showLoading({ title: "下载图片中..." });
        try {
          const downloadRes = await common_vendor.index.downloadFile({ url });
          if (downloadRes.statusCode === 200) {
            localPath = downloadRes.tempFilePath;
          } else {
            throw new Error("下载图片失败");
          }
        } finally {
          common_vendor.index.hideLoading();
        }
      }
      await common_vendor.index.saveImageToPhotosAlbum({ filePath: localPath });
      common_vendor.index.showToast({
        title: "保存成功",
        icon: "success"
      });
      resolve(true);
    } catch (error) {
      common_vendor.index.__f__("error", "at pages/myOrganizationsPage/myOrganizationsPage.js:221", "保存图片失败:", error);
      common_vendor.index.showToast({
        title: "保存失败，请检查授权",
        icon: "none"
      });
      resolve(false);
    }
  });
};
const _sfc_main = {
  data() {
    return {
      // 导航栏相关
      statusBarHeight: 20,
      // 默认状态栏高度
      navHeight: 64,
      // 默认导航栏高度（状态栏 + 导航内容）
      // Tab配置
      tabs: [
        { text: "我的已加组织" },
        { text: "发现组织" }
      ],
      currentTab: 0,
      // 状态标志
      loading: false,
      refreshing: false,
      loadingMore: false,
      qrCodeLoading: true,
      // 已加入组织数据
      joinedOrganizations: [],
      // 可发现组织数据
      discoverableOrganizations: [],
      searchText: "",
      selectedCategory: "",
      page: 1,
      limit: 10,
      hasMoreData: true,
      // 分类筛选
      categories: [
        { label: "全部", value: "" },
        { label: "校友总会", value: "main" },
        { label: "地方分会", value: "local" },
        { label: "院系分会", value: "college" },
        { label: "专业分会", value: "major" }
      ],
      // 二维码弹窗
      showQrModal: false,
      currentDisplayOrg: {}
    };
  },
  // 生命周期钩子
  onLoad() {
    this.getStatusBarHeight();
    this.loadData(true);
  },
  onShow() {
  },
  onPullDownRefresh() {
    this.refreshing = true;
    this.loadData(false);
    setTimeout(() => {
      this.refreshing = false;
      common_vendor.index.stopPullDownRefresh();
    }, 1e3);
  },
  onReachBottom() {
    if (this.currentTab === 1 && this.hasMoreData && !this.loadingMore) {
      this.loadMoreDiscoverable();
    }
  },
  methods: {
    /**
     * 获取系统状态栏高度
     */
    getStatusBarHeight() {
      try {
        const systemInfo = common_vendor.index.getSystemInfoSync();
        this.statusBarHeight = systemInfo.statusBarHeight || 20;
        this.navHeight = this.statusBarHeight + 44;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/myOrganizationsPage/myOrganizationsPage.vue:288", "获取系统信息失败", e);
      }
    },
    /**
     * 加载页面数据
     * @param {Boolean} showLoading 是否显示加载中提示
     */
    async loadData(showLoading = true) {
      if (showLoading) {
        this.loading = true;
      }
      if (this.currentTab === 0) {
        await this.loadJoinedOrganizations();
      } else {
        this.resetDiscoverableParams();
        await this.loadDiscoverableOrganizations();
        if (this.joinedOrganizations.length === 0) {
          this.loadJoinedOrganizations(false);
        }
      }
      if (showLoading) {
        this.loading = false;
      }
    },
    /**
     * 加载已加入组织列表
     * @param {Boolean} showToast 是否显示错误提示
     */
    async loadJoinedOrganizations(showToast = true) {
      try {
        const result = await getMyJoinedOrganizations();
        this.joinedOrganizations = result || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/myOrganizationsPage/myOrganizationsPage.vue:327", "加载已加入组织失败:", error);
        if (showToast) {
          this.showToast("获取组织列表失败");
        }
      }
    },
    /**
     * 加载可发现组织列表
     */
    async loadDiscoverableOrganizations() {
      try {
        const result = await getDiscoverableOrganizations({
          page: this.page,
          limit: this.limit,
          keyword: this.searchText,
          category: this.selectedCategory
        });
        if (this.page === 1) {
          this.discoverableOrganizations = result.data || [];
        } else {
          this.discoverableOrganizations = [
            ...this.discoverableOrganizations,
            ...result.data || []
          ];
        }
        this.hasMoreData = this.discoverableOrganizations.length < result.total;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/myOrganizationsPage/myOrganizationsPage.vue:358", "加载可发现组织列表失败:", error);
        this.showToast("获取组织列表失败");
      }
    },
    /**
     * 加载更多可发现组织
     */
    async loadMoreDiscoverable() {
      if (this.loadingMore || !this.hasMoreData)
        return;
      this.loadingMore = true;
      this.page++;
      await this.loadDiscoverableOrganizations();
      this.loadingMore = false;
    },
    /**
     * 重置发现组织参数
     */
    resetDiscoverableParams() {
      this.page = 1;
      this.hasMoreData = true;
    },
    /**
     * 重置所有筛选条件
     */
    resetFilters() {
      this.searchText = "";
      this.selectedCategory = "";
      this.resetDiscoverableParams();
      this.loadDiscoverableOrganizations();
    },
    /**
     * Tab切换处理函数
     */
    onTabChange(e) {
      if (this.currentTab === e.index)
        return;
      this.currentTab = e.index;
      this.loadData(true);
    },
    /**
     * 搜索处理函数
     */
    onSearchConfirm(e) {
      const value = typeof e.detail === "object" ? e.detail.value : this.searchText;
      if (this.searchText === value)
        return;
      this.searchText = value;
      this.resetDiscoverableParams();
      this.loadDiscoverableOrganizations();
    },
    /**
     * 清空搜索关键词
     */
    onSearchClear() {
      if (!this.searchText)
        return;
      this.searchText = "";
      this.resetDiscoverableParams();
      this.loadDiscoverableOrganizations();
    },
    /**
     * 选择分类
     */
    selectCategory(category) {
      if (this.selectedCategory === category)
        return;
      this.selectedCategory = category;
      this.resetDiscoverableParams();
      this.loadDiscoverableOrganizations();
    },
    /**
     * 显示二维码
     */
    showQrCode(org) {
      this.qrCodeLoading = true;
      this.currentDisplayOrg = org;
      this.showQrModal = true;
      setTimeout(() => {
        this.qrCodeLoading = false;
      }, 500);
    },
    /**
     * 处理二维码图片加载错误
     */
    handleQrCodeError() {
      this.showToast("二维码加载失败");
    },
    /**
     * 关闭二维码弹窗
     */
    handleCloseQrModal() {
      this.showQrModal = false;
      setTimeout(() => {
        this.currentDisplayOrg = {};
      }, 300);
    },
    /**
     * 保存二维码到相册
     */
    async saveQrToAlbum() {
      if (!this.currentDisplayOrg || !this.currentDisplayOrg.qrCodeUrl) {
        this.showToast("二维码获取失败");
        return;
      }
      const success = await saveImageToPhotosAlbum(this.currentDisplayOrg.qrCodeUrl);
      if (success) {
        setTimeout(() => {
          this.handleCloseQrModal();
        }, 1500);
      }
    },
    /**
     * 申请加入组织
     */
    async joinOrganization(org) {
      if (!org || org.status !== "joinable")
        return;
      common_vendor.index.showLoading({ title: "申请中..." });
      try {
        const result = await requestToJoinOrganization(org.id);
        if (result.success) {
          const index = this.discoverableOrganizations.findIndex((item) => item.id === org.id);
          if (index !== -1) {
            this.$set(this.discoverableOrganizations[index], "status", "pending");
          }
          this.showToast("申请已提交", "success");
        } else {
          this.showToast(result.message || "申请失败");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/myOrganizationsPage/myOrganizationsPage.vue:509", "申请加入组织失败:", error);
        this.showToast("申请失败，请稍后再试");
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    /**
     * 根据组织状态获取按钮文本
     */
    getButtonText(org) {
      switch (org.status) {
        case "pending":
          return "审核中";
        case "rejected":
          return "已拒绝";
        case "joined":
          return "已加入";
        default:
          return "申请加入";
      }
    },
    /**
     * 根据组织状态获取按钮样式
     */
    getButtonClass(org) {
      switch (org.status) {
        case "pending":
          return "disabled-btn";
        case "rejected":
          return "disabled-btn";
        case "joined":
          return "secondary-btn";
        default:
          return "primary-btn";
      }
    },
    /**
     * 处理组织Logo加载错误
     */
    handleLogoError(index, type) {
      const defaultLogo = "/static/images/org_logo_default.png";
      if (type === "joined" && this.joinedOrganizations[index]) {
        this.$set(this.joinedOrganizations[index], "logoUrl", defaultLogo);
      } else if (type === "discover" && this.discoverableOrganizations[index]) {
        this.$set(this.discoverableOrganizations[index], "logoUrl", defaultLogo);
      }
    },
    /**
     * 切换到发现组织Tab
     */
    switchToDiscover() {
      this.currentTab = 1;
      this.loadData(true);
    },
    /**
     * 显示Toast消息
     */
    showToast(title, icon = "none") {
      common_vendor.index.showToast({
        title,
        icon
      });
    },
    /**
     * 返回上一页
     */
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.statusBarHeight + "px",
    c: $data.navHeight + "px",
    d: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.text),
        b: index,
        c: common_vendor.n($data.currentTab === index ? "custom-tab-active" : ""),
        d: common_vendor.o(($event) => $options.onTabChange({
          index
        }), index)
      };
    }),
    e: `translateX(${$data.currentTab * 100}%)`,
    f: $data.currentTab === 0
  }, $data.currentTab === 0 ? common_vendor.e({
    g: $data.joinedOrganizations.length > 0
  }, $data.joinedOrganizations.length > 0 ? {
    h: common_vendor.f($data.joinedOrganizations, (org, index, i0) => {
      return {
        a: org.logoUrl,
        b: common_vendor.o(($event) => $options.handleLogoError(index, "joined"), org.id),
        c: common_vendor.t(org.name),
        d: common_vendor.t(org.type),
        e: common_vendor.o(($event) => $options.showQrCode(org), org.id),
        f: org.id
      };
    })
  } : $data.loading ? {} : {
    j: common_vendor.o((...args) => $options.switchToDiscover && $options.switchToDiscover(...args))
  }, {
    i: $data.loading
  }) : common_vendor.e({
    k: $data.searchText,
    l: common_vendor.o((...args) => $options.onSearchConfirm && $options.onSearchConfirm(...args)),
    m: $data.searchText
  }, $data.searchText ? {
    n: common_vendor.o((...args) => $options.onSearchClear && $options.onSearchClear(...args))
  } : {}, {
    o: common_vendor.o((...args) => $options.onSearchConfirm && $options.onSearchConfirm(...args)),
    p: common_vendor.f($data.categories, (item, index, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: index,
        c: common_vendor.n($data.selectedCategory === item.value ? "active" : ""),
        d: common_vendor.o(($event) => $options.selectCategory(item.value), index)
      };
    }),
    q: $data.discoverableOrganizations.length > 0
  }, $data.discoverableOrganizations.length > 0 ? common_vendor.e({
    r: common_vendor.f($data.discoverableOrganizations, (org, index, i0) => {
      return {
        a: org.logoUrl,
        b: common_vendor.o(($event) => $options.handleLogoError(index, "discover"), org.id),
        c: common_vendor.t(org.name),
        d: common_vendor.t(org.description || org.type),
        e: common_vendor.t($options.getButtonText(org)),
        f: common_vendor.n($options.getButtonClass(org)),
        g: common_vendor.o(($event) => org.status === "joinable" && $options.joinOrganization(org), org.id),
        h: org.id
      };
    }),
    s: !$data.loadingMore && $data.hasMoreData
  }, !$data.loadingMore && $data.hasMoreData ? {
    t: common_vendor.o((...args) => $options.loadMoreDiscoverable && $options.loadMoreDiscoverable(...args))
  } : $data.loadingMore ? {} : !$data.hasMoreData && $data.discoverableOrganizations.length > 0 ? {} : {}, {
    v: $data.loadingMore,
    w: !$data.hasMoreData && $data.discoverableOrganizations.length > 0
  }) : $data.loading ? {} : common_vendor.e({
    y: common_vendor.t($data.searchText || $data.selectedCategory ? "未找到相关组织，请尝试更换关键词或筛选条件" : "暂无可加入的校友组织"),
    z: $data.searchText || $data.selectedCategory
  }, $data.searchText || $data.selectedCategory ? {
    A: common_vendor.o((...args) => $options.resetFilters && $options.resetFilters(...args))
  } : {}), {
    x: $data.loading
  }), {
    B: $data.navHeight + "px",
    C: $data.showQrModal
  }, $data.showQrModal ? common_vendor.e({
    D: common_vendor.t($data.currentDisplayOrg.name),
    E: $data.qrCodeLoading
  }, $data.qrCodeLoading ? {} : {
    F: $data.currentDisplayOrg.qrCodeUrl,
    G: common_vendor.o((...args) => $options.handleQrCodeError && $options.handleQrCodeError(...args))
  }, {
    H: common_vendor.o((...args) => $options.saveQrToAlbum && $options.saveQrToAlbum(...args)),
    I: common_vendor.o((...args) => $options.handleCloseQrModal && $options.handleCloseQrModal(...args)),
    J: common_vendor.o(() => {
    }),
    K: common_vendor.o((...args) => $options.handleCloseQrModal && $options.handleCloseQrModal(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/myOrganizationsPage/myOrganizationsPage.js.map

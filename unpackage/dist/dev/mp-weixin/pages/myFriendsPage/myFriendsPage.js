"use strict";
const common_vendor = require("../../common/vendor.js");
const api_friends = require("../../api/friends.js");
const mockFriendCategories = [
  {
    code: "all",
    name: "全部好友",
    icon: "user-heart",
    color: "#FF5722",
    count: "8/8"
  },
  {
    code: "friends",
    name: "朋友",
    icon: "user-smile",
    color: "#333333",
    count: "3/3"
  },
  {
    code: "teachers",
    name: "老师",
    icon: "book-open",
    color: "#333333",
    count: "1/1"
  },
  {
    code: "classmates",
    name: "同学",
    icon: "graduation-cap",
    color: "#2A6DCF",
    count: "4/4"
  },
  {
    code: "alumni",
    name: "校友",
    icon: "building-4",
    color: "#333333",
    count: "2/2"
  }
];
const mockFriends = [
  {
    id: "001",
    name: "张教授",
    avatar: "/static/images/avatar/avatar1.png",
    department: "计算机学院",
    enrollYear: "2010",
    major: "计算机科学与技术",
    categories: ["all", "teachers"],
    phone: "13800138000",
    wechat: "zhangprof",
    qq: "123456789",
    email: "zhang@example.com",
    remark: ""
  },
  {
    id: "002",
    name: "李同学",
    avatar: "/static/images/avatar/avatar2.png",
    department: "计算机学院",
    enrollYear: "2018",
    major: "软件工程",
    categories: ["all", "classmates", "friends"],
    phone: "13900139000",
    wechat: "li_student",
    qq: "987654321",
    email: "li@example.com",
    remark: "前端开发小组组长"
  },
  {
    id: "003",
    name: "王同学",
    avatar: "/static/images/avatar/avatar3.png",
    department: "计算机学院",
    enrollYear: "2018",
    major: "人工智能",
    categories: ["all", "classmates"],
    phone: "13700137000",
    wechat: "wang_ai",
    qq: "456789123",
    email: "wang@example.com",
    remark: ""
  },
  {
    id: "004",
    name: "赵同学",
    avatar: "/static/images/avatar/avatar4.png",
    department: "计算机学院",
    enrollYear: "2018",
    major: "网络工程",
    categories: ["all", "classmates"],
    phone: "13600136000",
    wechat: "zhao_net",
    qq: "789123456",
    email: "zhao@example.com",
    remark: ""
  },
  {
    id: "005",
    name: "钱同学",
    avatar: "/static/images/avatar/avatar5.png",
    department: "计算机学院",
    enrollYear: "2018",
    major: "信息安全",
    categories: ["all", "classmates", "friends"],
    phone: "13500135000",
    wechat: "qian_security",
    qq: "321654987",
    email: "qian@example.com",
    remark: ""
  },
  {
    id: "006",
    name: "孙校友",
    avatar: "/static/images/avatar/avatar6.png",
    department: "计算机学院",
    enrollYear: "2016",
    major: "软件工程",
    categories: ["all", "alumni"],
    phone: "13400134000",
    wechat: "sun_alumni",
    qq: "654987321",
    email: "sun@example.com",
    remark: "现就职于腾讯"
  },
  {
    id: "007",
    name: "周校友",
    avatar: "/static/images/avatar/avatar7.png",
    department: "计算机学院",
    enrollYear: "2015",
    major: "计算机科学与技术",
    categories: ["all", "alumni", "friends"],
    phone: "13300133000",
    wechat: "zhou_alumni",
    qq: "159357486",
    email: "zhou@example.com",
    remark: "现就职于阿里巴巴"
  },
  {
    id: "008",
    name: "吴同学",
    avatar: "/static/images/avatar/avatar8.png",
    department: "电子工程学院",
    enrollYear: "2019",
    major: "电子工程",
    categories: ["all"],
    phone: "13200132000",
    wechat: "wu_ee",
    qq: "258369147",
    email: "wu@example.com",
    remark: ""
  }
];
const mockFriendRequests = [
  {
    id: "req001",
    userId: "101",
    name: "朱同学",
    avatar: "/static/images/avatar/avatar9.png",
    department: "机械工程学院",
    enrollYear: "2019",
    major: "机械设计与制造",
    message: "我是朱同学，想加你为好友",
    time: "2023-09-15 14:30",
    status: "pending"
    // pending, accepted, rejected
  },
  {
    id: "req002",
    userId: "102",
    name: "陈教授",
    avatar: "/static/images/avatar/avatar10.png",
    department: "电子工程学院",
    enrollYear: "2008",
    major: "电子信息工程",
    message: "我是电子工程学院的陈教授，看到你在论坛上发表的文章很有见解，希望加你为好友交流",
    time: "2023-09-14 09:15",
    status: "pending"
  },
  {
    id: "req003",
    userId: "103",
    name: "刘校友",
    avatar: "/static/images/avatar/avatar11.png",
    department: "计算机学院",
    enrollYear: "2015",
    major: "信息安全",
    message: "我是2015级信息安全专业毕业的刘校友，现在在华为工作，想和你交流一下",
    time: "2023-09-12 16:45",
    status: "pending"
  }
];
const getFriendCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFriendCategories);
    }, 300);
  });
};
const getMyFriends = async () => {
  try {
    const response = await api_friends.getFriendsList();
    return response.data || [];
  } catch (error) {
    common_vendor.index.__f__("error", "at pages/myFriendsPage/myFriendsPage.js:363", "获取好友列表失败:", error);
    return mockFriends;
  }
};
const getMyFriendRequests = async () => {
  try {
    const response = await api_friends.getFriendRequests();
    return response.data || [];
  } catch (error) {
    common_vendor.index.__f__("error", "at pages/myFriendsPage/myFriendsPage.js:375", "获取好友申请列表失败:", error);
    return mockFriendRequests;
  }
};
const deleteFriend = async (friendId) => {
  try {
    const response = await api_friends.removeFriend(friendId);
    return response;
  } catch (error) {
    common_vendor.index.__f__("error", "at pages/myFriendsPage/myFriendsPage.js:387", "删除好友失败:", error);
    throw error;
  }
};
const handleMyFriendRequest = async (requestId, action) => {
  try {
    const response = await api_friends.handleFriendRequest(requestId, action);
    return response;
  } catch (error) {
    common_vendor.index.__f__("error", "at pages/myFriendsPage/myFriendsPage.js:465", "处理好友申请失败:", error);
    throw error;
  }
};
const clearFriendRequests = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      common_vendor.index.__f__("log", "at pages/myFriendsPage/myFriendsPage.js:476", "清空所有好友验证信息");
      const result = {
        success: true,
        message: "已清空所有验证信息"
      };
      resolve(result);
    }, 1e3);
  });
};
const _sfc_main = {
  data() {
    return {
      // 页面Tab
      currentTab: "friends",
      // 搜索相关
      searchText: "",
      isSearchMode: false,
      // 分类相关
      categories: [],
      selectedCategory: null,
      expandedCategory: null,
      // 好友列表
      allFriends: [],
      currentFriends: [],
      // 好友申请
      friendRequests: [],
      // 联系方式弹窗
      showContactPopup: false,
      currentContact: {},
      // 操作菜单相关
      showActionSheet: false,
      actionOptions: [
        { text: "设置备注", color: "#333333" },
        { text: "移动至其他分组", color: "#333333" },
        { text: "删除好友", color: "#FF0000" }
      ],
      currentFriend: null,
      // 确认对话框
      showConfirmDialog: false
    };
  },
  computed: {
    showEmpty() {
      return this.allFriends.length === 0 && !this.isSearchMode && this.currentTab === "friends";
    },
    pendingRequestsCount() {
      return this.friendRequests.filter((req) => req.status === "pending").length;
    }
  },
  onLoad() {
    this.loadCategories();
    this.loadFriends();
    this.loadFriendRequests();
  },
  methods: {
    // 切换Tab
    switchTab(tab) {
      if (this.currentTab === tab)
        return;
      this.currentTab = tab;
      this.expandedCategory = null;
      this.searchText = "";
      this.isSearchMode = false;
    },
    // 加载好友申请
    loadFriendRequests() {
      getMyFriendRequests().then((res) => {
        this.friendRequests = res;
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/myFriendsPage/myFriendsPage.vue:340", "获取好友申请失败", err);
        common_vendor.index.showToast({
          title: "获取好友申请失败",
          icon: "none"
        });
      });
    },
    // 处理好友申请
    handleRequest(requestId, action) {
      common_vendor.index.showLoading({
        title: action === "accept" ? "正在接受..." : "正在拒绝..."
      });
      handleMyFriendRequest(requestId, action).then((res) => {
        if (res.success) {
          const index = this.friendRequests.findIndex((req) => req.id === requestId);
          if (index !== -1) {
            this.friendRequests[index].status = res.status;
          }
          if (action === "accept") {
            this.loadFriends();
          }
          common_vendor.index.showToast({
            title: action === "accept" ? "已同意" : "已拒绝",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: "操作失败，请重试",
            icon: "none"
          });
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/myFriendsPage/myFriendsPage.vue:378", "处理好友申请失败", err);
        common_vendor.index.showToast({
          title: "操作失败，请重试",
          icon: "none"
        });
      }).finally(() => {
        common_vendor.index.hideLoading();
      });
    },
    // 获取状态文本
    getStatusText(status) {
      switch (status) {
        case "pending":
          return "等待验证";
        case "accepted":
          return "已同意";
        case "rejected":
          return "已拒绝";
        default:
          return "";
      }
    },
    // 导航相关
    goBack() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    openManage() {
      common_vendor.index.showToast({
        title: "分组管理功能开发中",
        icon: "none"
      });
    },
    navigateToDiscover() {
      common_vendor.index.navigateTo({
        url: "/pages/discoverAlumniPage/discoverAlumniPage"
      });
    },
    // 数据加载
    loadCategories() {
      getFriendCategories().then((res) => {
        this.categories = res;
        this.selectedCategory = this.categories.find((item) => item.code === "all");
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/myFriendsPage/myFriendsPage.vue:427", "获取好友分类失败", err);
        common_vendor.index.showToast({
          title: "获取好友分类失败",
          icon: "none"
        });
      });
    },
    loadFriends() {
      getMyFriends().then((res) => {
        this.allFriends = res;
        this.filterFriends();
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/myFriendsPage/myFriendsPage.vue:439", "获取好友列表失败", err);
        common_vendor.index.showToast({
          title: "获取好友列表失败",
          icon: "none"
        });
      });
    },
    // 筛选好友列表
    filterFriends() {
      if (this.isSearchMode) {
        const searchText = this.searchText.toLowerCase();
        this.currentFriends = this.allFriends.filter(
          (friend) => friend.name.toLowerCase().includes(searchText) || friend.department.toLowerCase().includes(searchText) || friend.major.toLowerCase().includes(searchText)
        );
      } else if (this.selectedCategory) {
        this.currentFriends = this.getCategoryFriends(this.selectedCategory.code);
      } else {
        this.currentFriends = this.allFriends;
      }
    },
    // 分类与筛选
    toggleCategory(category) {
      if (this.expandedCategory === category.code) {
        this.expandedCategory = null;
      } else {
        this.expandedCategory = category.code;
      }
      this.selectedCategory = category;
    },
    // 获取指定分类下的好友
    getCategoryFriends(categoryCode) {
      return this.allFriends.filter(
        (friend) => friend.categories && friend.categories.includes(categoryCode)
      );
    },
    // 搜索功能
    searchFriends() {
      if (!this.searchText.trim()) {
        this.isSearchMode = false;
        return;
      }
      this.isSearchMode = true;
      this.expandedCategory = null;
      const keyword = this.searchText.toLowerCase().trim();
      this.currentFriends = this.allFriends.filter((friend) => {
        return friend.name.toLowerCase().includes(keyword) || friend.department && friend.department.toLowerCase().includes(keyword) || friend.remark && friend.remark.toLowerCase().includes(keyword) || friend.enrollYear && friend.enrollYear.toString().includes(keyword);
      });
    },
    clearSearch() {
      this.searchText = "";
      this.isSearchMode = false;
    },
    // 好友操作
    viewFriendDetail(friend) {
      common_vendor.index.showToast({
        title: "好友详情功能开发中",
        icon: "none"
      });
    },
    showContactInfo(friend) {
      this.currentContact = {
        phone: friend.phone || "",
        wechat: friend.wechat || "",
        qq: friend.qq || "",
        email: friend.email || ""
      };
      this.showContactPopup = true;
    },
    closeContactPopup() {
      this.showContactPopup = false;
    },
    // 联系方式操作
    handlePhone(phone) {
      common_vendor.index.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          common_vendor.index.showToast({
            title: "拨打电话失败",
            icon: "none"
          });
        }
      });
    },
    copyWechat(wechat) {
      common_vendor.index.setClipboardData({
        data: wechat,
        success: () => {
          common_vendor.index.showModal({
            title: "微信号已复制",
            content: "是否打开微信？",
            success: (res) => {
              if (res.confirm) {
                plus.runtime.openURL("weixin://");
              }
            }
          });
        }
      });
    },
    copyQQ(qq) {
      common_vendor.index.setClipboardData({
        data: qq,
        success: () => {
          common_vendor.index.showToast({
            title: "QQ号已复制",
            icon: "success"
          });
        }
      });
    },
    copyEmail(email) {
      common_vendor.index.setClipboardData({
        data: email,
        success: () => {
          common_vendor.index.showToast({
            title: "邮箱已复制",
            icon: "success"
          });
        }
      });
    },
    // 操作菜单
    showActionMenu(friend) {
      this.currentFriend = friend;
      this.showActionSheet = true;
    },
    closeActionSheet() {
      this.showActionSheet = false;
    },
    handleActionClick(e) {
      const index = e.index;
      if (index === 0) {
        common_vendor.index.showToast({
          title: "设置备注功能开发中",
          icon: "none"
        });
      } else if (index === 1) {
        common_vendor.index.showToast({
          title: "移动分组功能开发中",
          icon: "none"
        });
      } else if (index === 2) {
        this.showConfirmDialog = true;
      }
      this.closeActionSheet();
    },
    // 确认对话框
    closeConfirmDialog() {
      this.showConfirmDialog = false;
    },
    confirmDelete() {
      if (!this.currentFriend) {
        this.closeConfirmDialog();
        return;
      }
      deleteFriend(this.currentFriend.id).then(() => {
        this.allFriends = this.allFriends.filter((f) => f.id !== this.currentFriend.id);
        this.filterFriends();
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "success"
        });
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/myFriendsPage/myFriendsPage.vue:635", "删除好友失败", err);
        common_vendor.index.showToast({
          title: "删除好友失败",
          icon: "none"
        });
      }).finally(() => {
        this.closeConfirmDialog();
      });
    },
    // 清空好友验证信息
    clearFriendRequests() {
      common_vendor.index.showModal({
        title: "确认清空",
        content: "确定要清空所有验证信息吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "正在清空..."
            });
            clearFriendRequests().then((res2) => {
              if (res2.success) {
                this.friendRequests = [];
                common_vendor.index.showToast({
                  title: "已清空验证信息",
                  icon: "success"
                });
              } else {
                common_vendor.index.showToast({
                  title: "清空失败，请重试",
                  icon: "none"
                });
              }
            }).catch((err) => {
              common_vendor.index.__f__("error", "at pages/myFriendsPage/myFriendsPage.vue:670", "清空验证信息失败", err);
              common_vendor.index.showToast({
                title: "清空失败，请重试",
                icon: "none"
              });
            }).finally(() => {
              common_vendor.index.hideLoading();
            });
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_fui_bottom_popup2 = common_vendor.resolveComponent("fui-bottom-popup");
  const _easycom_fui_actionsheet2 = common_vendor.resolveComponent("fui-actionsheet");
  const _easycom_fui_dialog2 = common_vendor.resolveComponent("fui-dialog");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_fui_bottom_popup2 + _easycom_fui_actionsheet2 + _easycom_fui_dialog2)();
}
const _easycom_fui_icon = () => "../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_fui_bottom_popup = () => "../../components/firstui/fui-bottom-popup/fui-bottom-popup.js";
const _easycom_fui_actionsheet = () => "../../components/firstui/fui-actionsheet/fui-actionsheet.js";
const _easycom_fui_dialog = () => "../../components/firstui/fui-dialog/fui-dialog.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar + _easycom_fui_bottom_popup + _easycom_fui_actionsheet + _easycom_fui_dialog)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      name: "arrowleft",
      color: "#FFFFFF",
      size: 36
    }),
    b: common_vendor.p({
      name: "settings-3",
      color: "#FFFFFF",
      size: 36
    }),
    c: common_vendor.o((...args) => $options.openManage && $options.openManage(...args)),
    d: common_vendor.o($options.goBack),
    e: common_vendor.p({
      title: "我的好友",
      background: "#004299",
      color: "#FFFFFF",
      fontWeight: "bold",
      splitLine: true,
      isFixed: true,
      isOccupy: true
    }),
    f: common_vendor.n($data.currentTab === "friends" ? "tab-active" : ""),
    g: common_vendor.o(($event) => $options.switchTab("friends")),
    h: $options.pendingRequestsCount > 0
  }, $options.pendingRequestsCount > 0 ? {
    i: common_vendor.t($options.pendingRequestsCount)
  } : {}, {
    j: common_vendor.n($data.currentTab === "requests" ? "tab-active" : ""),
    k: common_vendor.o(($event) => $options.switchTab("requests")),
    l: $data.currentTab === "friends"
  }, $data.currentTab === "friends" ? common_vendor.e({
    m: common_vendor.p({
      name: "search",
      color: "#999",
      size: 36
    }),
    n: common_vendor.o([($event) => $data.searchText = $event.detail.value, (...args) => $options.searchFriends && $options.searchFriends(...args)]),
    o: $data.searchText,
    p: $data.searchText
  }, $data.searchText ? {
    q: common_vendor.o($options.clearSearch),
    r: common_vendor.p({
      name: "clear",
      color: "#999",
      size: 36
    })
  } : {}, {
    s: !$data.isSearchMode
  }, !$data.isSearchMode ? {
    t: common_vendor.f($data.categories, (category, index, i0) => {
      return common_vendor.e({
        a: "efcef5b2-5-" + i0,
        b: common_vendor.p({
          name: category.icon,
          color: category.color,
          size: 40
        }),
        c: common_vendor.t(category.name),
        d: common_vendor.t(category.count),
        e: "efcef5b2-6-" + i0,
        f: $data.expandedCategory === category.code ? 1 : "",
        g: $data.expandedCategory === category.code ? 1 : "",
        h: common_vendor.o(($event) => $options.toggleCategory(category), index),
        i: $data.expandedCategory === category.code
      }, $data.expandedCategory === category.code ? common_vendor.e({
        j: $options.getCategoryFriends(category.code).length === 0
      }, $options.getCategoryFriends(category.code).length === 0 ? {} : {
        k: common_vendor.f($options.getCategoryFriends(category.code), (friend, friendIndex, i1) => {
          return common_vendor.e({
            a: friend.avatar,
            b: common_vendor.t(friend.name),
            c: friend.remark
          }, friend.remark ? {
            d: common_vendor.t(friend.remark)
          } : {}, {
            e: common_vendor.t(friend.department),
            f: common_vendor.t(friend.enrollYear),
            g: friend.major
          }, friend.major ? {
            h: common_vendor.t(friend.major)
          } : {}, {
            i: "efcef5b2-7-" + i0 + "-" + i1,
            j: common_vendor.o(($event) => $options.showContactInfo(friend), friend.id),
            k: friend.id,
            l: common_vendor.o(($event) => $options.viewFriendDetail(friend), friend.id),
            m: common_vendor.o(($event) => $options.showActionMenu(friend), friend.id)
          });
        }),
        l: common_vendor.p({
          name: "contacts",
          color: "#2A6DCF",
          size: 40
        })
      }) : {}, {
        m: index
      });
    }),
    v: common_vendor.p({
      name: "right",
      color: "#999",
      size: 32
    })
  } : {}, {
    w: $data.isSearchMode && $data.currentFriends.length > 0
  }, $data.isSearchMode && $data.currentFriends.length > 0 ? {
    x: common_vendor.t($data.currentFriends.length),
    y: common_vendor.f($data.currentFriends, (friend, index, i0) => {
      return common_vendor.e({
        a: friend.avatar,
        b: common_vendor.t(friend.name),
        c: friend.remark
      }, friend.remark ? {
        d: common_vendor.t(friend.remark)
      } : {}, {
        e: common_vendor.t(friend.department),
        f: common_vendor.t(friend.enrollYear),
        g: friend.major
      }, friend.major ? {
        h: common_vendor.t(friend.major)
      } : {}, {
        i: "efcef5b2-8-" + i0,
        j: common_vendor.o(($event) => $options.showContactInfo(friend), friend.id),
        k: friend.id,
        l: common_vendor.o(($event) => $options.viewFriendDetail(friend), friend.id),
        m: common_vendor.o(($event) => $options.showActionMenu(friend), friend.id)
      });
    }),
    z: common_vendor.p({
      name: "contacts",
      color: "#2A6DCF",
      size: 40
    })
  } : {}, {
    A: $data.isSearchMode && $data.currentFriends.length === 0
  }, $data.isSearchMode && $data.currentFriends.length === 0 ? {
    B: common_vendor.p({
      name: "search",
      color: "#cccccc",
      size: 80
    })
  } : {}, {
    C: $options.showEmpty
  }, $options.showEmpty ? {
    D: common_vendor.p({
      name: "user-search",
      color: "#cccccc",
      size: 100
    }),
    E: common_vendor.o((...args) => $options.navigateToDiscover && $options.navigateToDiscover(...args))
  } : {}) : {}, {
    F: $data.currentTab === "requests"
  }, $data.currentTab === "requests" ? common_vendor.e({
    G: $data.friendRequests.length > 0
  }, $data.friendRequests.length > 0 ? {
    H: common_vendor.t($data.friendRequests.length),
    I: common_vendor.o((...args) => $options.clearFriendRequests && $options.clearFriendRequests(...args))
  } : {}, {
    J: $data.friendRequests.length === 0
  }, $data.friendRequests.length === 0 ? {
    K: common_vendor.p({
      name: "mail",
      color: "#cccccc",
      size: 80
    })
  } : {
    L: common_vendor.f($data.friendRequests, (request, index, i0) => {
      return common_vendor.e({
        a: request.avatar,
        b: common_vendor.t(request.name),
        c: common_vendor.t($options.getStatusText(request.status)),
        d: common_vendor.n("status-" + request.status),
        e: common_vendor.t(request.department),
        f: common_vendor.t(request.enrollYear),
        g: common_vendor.t(request.major),
        h: common_vendor.t(request.message),
        i: common_vendor.t(request.time),
        j: request.status === "pending"
      }, request.status === "pending" ? {
        k: common_vendor.o(($event) => $options.handleRequest(request.id, "accept"), request.id),
        l: common_vendor.o(($event) => $options.handleRequest(request.id, "reject"), request.id)
      } : {}, {
        m: request.id
      });
    })
  }) : {}, {
    M: common_vendor.o($options.closeContactPopup),
    N: common_vendor.p({
      name: "close",
      size: 32,
      color: "#333"
    }),
    O: $data.currentContact.phone
  }, $data.currentContact.phone ? {
    P: common_vendor.p({
      name: "phone",
      color: "#2A6DCF",
      size: 40
    }),
    Q: common_vendor.t($data.currentContact.phone),
    R: common_vendor.p({
      name: "phone-fill",
      color: "#4CAF50",
      size: 40
    }),
    S: common_vendor.o(($event) => $options.handlePhone($data.currentContact.phone))
  } : {}, {
    T: $data.currentContact.wechat
  }, $data.currentContact.wechat ? {
    U: common_vendor.p({
      name: "wechat",
      color: "#2A6DCF",
      size: 40
    }),
    V: common_vendor.t($data.currentContact.wechat),
    W: common_vendor.p({
      name: "copy",
      color: "#4CAF50",
      size: 40
    }),
    X: common_vendor.o(($event) => $options.copyWechat($data.currentContact.wechat))
  } : {}, {
    Y: $data.currentContact.qq
  }, $data.currentContact.qq ? {
    Z: common_vendor.p({
      name: "qq",
      color: "#2A6DCF",
      size: 40
    }),
    aa: common_vendor.t($data.currentContact.qq),
    ab: common_vendor.p({
      name: "copy",
      color: "#4CAF50",
      size: 40
    }),
    ac: common_vendor.o(($event) => $options.copyQQ($data.currentContact.qq))
  } : {}, {
    ad: $data.currentContact.email
  }, $data.currentContact.email ? {
    ae: common_vendor.p({
      name: "mail",
      color: "#2A6DCF",
      size: 40
    }),
    af: common_vendor.t($data.currentContact.email),
    ag: common_vendor.p({
      name: "copy",
      color: "#4CAF50",
      size: 40
    }),
    ah: common_vendor.o(($event) => $options.copyEmail($data.currentContact.email))
  } : {}, {
    ai: common_vendor.o($options.closeContactPopup),
    aj: common_vendor.p({
      show: $data.showContactPopup
    }),
    ak: common_vendor.o($options.handleActionClick),
    al: common_vendor.o($options.closeActionSheet),
    am: common_vendor.p({
      show: $data.showActionSheet,
      itemList: $data.actionOptions
    }),
    an: common_vendor.o($options.closeConfirmDialog),
    ao: common_vendor.o($options.confirmDelete),
    ap: common_vendor.p({
      show: $data.showConfirmDialog,
      title: "删除好友",
      content: "确定删除该好友吗？删除后将无法查看对方联系方式"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/myFriendsPage/myFriendsPage.js.map

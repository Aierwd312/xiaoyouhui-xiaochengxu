"use strict";
const common_vendor = require("../../common/vendor.js");
const departmentList = [
  { code: "01", name: "计算机学院" },
  { code: "02", name: "电子工程学院" },
  { code: "03", name: "机械工程学院" },
  { code: "04", name: "经济管理学院" },
  { code: "05", name: "医学院" },
  { code: "06", name: "法学院" },
  { code: "07", name: "文学院" },
  { code: "08", name: "外国语学院" },
  { code: "09", name: "数学学院" },
  { code: "10", name: "物理学院" }
];
const schoolTypeList = [
  { code: "01", name: "本科生" },
  { code: "02", name: "硕士研究生" },
  { code: "03", name: "博士研究生" },
  { code: "04", name: "教职工" },
  { code: "05", name: "校友" }
];
const industryList = [
  { code: "01", name: "信息技术" },
  { code: "02", name: "金融" },
  { code: "03", name: "教育" },
  { code: "04", name: "医疗健康" },
  { code: "05", name: "制造业" },
  { code: "06", name: "互联网" },
  { code: "07", name: "文化创意" },
  { code: "08", name: "法律" },
  { code: "09", name: "公共服务" },
  { code: "10", name: "其他" }
];
const mockSearchResults = {
  total: 5,
  list: [
    {
      id: "001",
      name: "张三",
      avatar: "/static/images/avatar/avatar1.png",
      department: "计算机学院",
      enrollYear: "2015",
      residence: "北京市海淀区",
      industry: "互联网",
      company: "腾讯科技",
      distance: "2.5公里"
    },
    {
      id: "002",
      name: "李四",
      avatar: "/static/images/avatar/avatar2.png",
      department: "经济管理学院",
      enrollYear: "2016",
      residence: "上海市浦东新区",
      industry: "金融",
      company: "中国银行",
      distance: "4.8公里"
    },
    {
      id: "003",
      name: "王五",
      avatar: "/static/images/avatar/avatar3.png",
      department: "法学院",
      enrollYear: "2017",
      residence: "广州市天河区",
      industry: "法律",
      company: "广东正大律师事务所",
      distance: "12.3公里"
    },
    {
      id: "004",
      name: "赵六",
      avatar: "/static/images/avatar/avatar4.png",
      department: "医学院",
      enrollYear: "2014",
      residence: "深圳市南山区",
      industry: "医疗健康",
      company: "深圳市第一人民医院",
      distance: "18.6公里"
    },
    {
      id: "005",
      name: "钱七",
      avatar: "/static/images/avatar/avatar5.png",
      department: "外国语学院",
      enrollYear: "2016",
      residence: "杭州市西湖区",
      industry: "教育",
      company: "杭州外国语学校",
      distance: "25.1公里"
    }
  ]
};
const mockClassmatesData = {
  total: 9,
  list: [
    {
      id: "101",
      name: "陈一",
      avatar: "/static/images/avatar/avatar6.png",
      department: "计算机学院",
      enrollYear: "2018",
      specialty: "软件工程"
    },
    {
      id: "102",
      name: "林二",
      avatar: "/static/images/avatar/avatar7.png",
      department: "计算机学院",
      enrollYear: "2018",
      specialty: "人工智能"
    },
    {
      id: "103",
      name: "黄三",
      avatar: "/static/images/avatar/avatar8.png",
      department: "计算机学院",
      enrollYear: "2018",
      specialty: "网络工程"
    },
    {
      id: "104",
      name: "杨四",
      avatar: "/static/images/avatar/avatar9.png",
      department: "计算机学院",
      enrollYear: "2018",
      specialty: "信息安全"
    },
    {
      id: "105",
      name: "周五",
      avatar: "/static/images/avatar/avatar10.png",
      department: "计算机学院",
      enrollYear: "2018",
      specialty: "数据科学"
    },
    {
      id: "106",
      name: "吴六",
      avatar: "/static/images/avatar/avatar11.png",
      department: "计算机学院",
      enrollYear: "2018",
      specialty: "软件工程"
    },
    {
      id: "107",
      name: "郑七",
      avatar: "/static/images/avatar/avatar12.png",
      department: "计算机学院",
      enrollYear: "2018",
      specialty: "人工智能"
    },
    {
      id: "108",
      name: "冯八",
      avatar: "/static/images/avatar/avatar13.png",
      department: "计算机学院",
      enrollYear: "2018",
      specialty: "网络工程"
    },
    {
      id: "109",
      name: "朱九",
      avatar: "/static/images/avatar/avatar14.png",
      department: "计算机学院",
      enrollYear: "2018",
      specialty: "信息安全"
    }
  ]
};
const searchAlumni = (params) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = mockSearchResults;
      resolve(mockData);
    }, 1500);
  });
};
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    common_vendor.index.getLocation({
      type: "gcj02",
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
const saveSearchHistory = (searchParams) => {
  try {
    const history = common_vendor.index.getStorageSync("alumni_search_history") || [];
    history.unshift({
      id: Date.now(),
      params: searchParams,
      time: (/* @__PURE__ */ new Date()).toISOString()
    });
    const newHistory = history.slice(0, 10);
    common_vendor.index.setStorageSync("alumni_search_history", newHistory);
    return true;
  } catch (e) {
    common_vendor.index.__f__("error", "at pages/discoverAlumniPage/discoverAlumniPage.js:235", "保存搜索历史失败", e);
    return false;
  }
};
const formatSchoolTypeData = () => {
  return schoolTypeList.map((item) => item.name);
};
const formatDepartmentData = () => {
  const years = ["全部"].concat(["2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016"]);
  const departments = ["全部"].concat(departmentList.map((item) => item.name));
  return [years, departments];
};
const formatResidenceData = () => {
  return [
    {
      text: "中国",
      value: "china",
      children: [
        {
          text: "北京市",
          value: "beijing",
          children: [
            { text: "海淀区", value: "haidian" },
            { text: "朝阳区", value: "chaoyang" },
            { text: "西城区", value: "xicheng" }
          ]
        },
        {
          text: "上海市",
          value: "shanghai",
          children: [
            { text: "浦东新区", value: "pudong" },
            { text: "徐汇区", value: "xuhui" },
            { text: "黄浦区", value: "huangpu" }
          ]
        },
        {
          text: "广东省",
          value: "guangdong",
          children: [
            { text: "广州市", value: "guangzhou" },
            { text: "深圳市", value: "shenzhen" },
            { text: "珠海市", value: "zhuhai" }
          ]
        }
      ]
    },
    {
      text: "美国",
      value: "usa",
      children: [
        {
          text: "加利福尼亚州",
          value: "california",
          children: [
            { text: "洛杉矶", value: "la" },
            { text: "旧金山", value: "sf" },
            { text: "圣地亚哥", value: "sd" }
          ]
        },
        {
          text: "纽约州",
          value: "newyork",
          children: [
            { text: "纽约市", value: "nyc" },
            { text: "布法罗", value: "buffalo" },
            { text: "罗切斯特", value: "rochester" }
          ]
        }
      ]
    }
  ];
};
const formatIndustryData = () => {
  return industryList.map((item) => item.name);
};
const _sfc_main = {
  data() {
    return {
      currentTab: "search",
      form: {
        name: "",
        schoolType: "",
        schoolTypeDesc: "",
        department: "",
        departmentDesc: "",
        year: "",
        residence: "",
        residenceDesc: "",
        industry: "",
        industryDesc: "",
        company: "",
        sortByDistance: false
      },
      isFavorite: false,
      isStarAnimating: false,
      // 搜索状态：initial(初始状态), loading(搜索中), noResult(无结果), hasResult(有结果)
      searchState: "initial",
      searchResults: {
        total: 0,
        list: []
      },
      classmatesData: {
        total: 0,
        list: []
      },
      // picker选择器索引
      schoolTypeIndex: [0],
      departmentIndex: [0, 0],
      residenceIndex: [0, 0, 0],
      industryIndex: [0],
      // picker组件显示控制
      pickerShow: {
        schoolType: false,
        department: false,
        residence: false,
        industry: false
      },
      // 选择器数据初始化为空，将在created钩子中初始化
      pickerOptions: {
        schoolType: [],
        department: [],
        residence: [],
        industry: []
      }
    };
  },
  created() {
    this.initPickerData();
    this.loadClassmatesData();
  },
  methods: {
    // 初始化选择器数据
    initPickerData() {
      this.pickerOptions.schoolType = formatSchoolTypeData();
      this.pickerOptions.department = formatDepartmentData();
      this.pickerOptions.residence = formatResidenceData();
      this.pickerOptions.industry = formatIndustryData();
      common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:302", "选择器数据初始化完成", this.pickerOptions);
    },
    // 加载同学数据
    loadClassmatesData() {
      this.classmatesData = mockClassmatesData;
    },
    // 添加好友
    addFriend(id) {
      common_vendor.index.showToast({
        title: "已发送好友申请",
        icon: "success"
      });
    },
    // 页面导航
    goBack() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    // 切换Tab
    switchTab(tab) {
      if (this.currentTab === tab)
        return;
      this.currentTab = tab;
      if (tab === "search") {
        this.searchState = "initial";
      } else if (tab === "classmates") {
        if (this.classmatesData.list.length === 0) {
          this.loadClassmatesData();
        }
      }
    },
    // 显示选择器
    showPicker(type) {
      this.pickerShow[type] = true;
      common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:348", `显示${type}选择器`);
    },
    // 关闭选择器
    closePicker(type) {
      this.pickerShow[type] = false;
      common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:354", `关闭${type}选择器`);
    },
    // 入校类型选择回调
    onSchoolTypeChange(e) {
      common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:359", "选择入校类型", e);
      this.closePicker("schoolType");
      common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:363", "入校类型选择回调数据:", JSON.stringify(e));
      if (e && e.index && Array.isArray(e.index)) {
        const index = e.index[0] || 0;
        const selected = schoolTypeList[index];
        if (selected) {
          this.form.schoolType = selected.code;
          this.form.schoolTypeDesc = selected.name;
          this.schoolTypeIndex = e.index;
          common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:377", "已选择入校类型:", selected.name, selected.code);
        }
      }
    },
    // 入校院系选择回调
    onDepartmentChange(e) {
      common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:384", "选择入校院系", e);
      this.closePicker("department");
      if (e && e.text && e.text.length >= 2) {
        const year = e.text[0];
        const dept = e.text[1];
        let desc = "";
        if (year === "全部" && dept === "全部") {
          desc = "不限年份，不限院系";
        } else if (year === "全部") {
          desc = `不限年份，${dept}`;
        } else if (dept === "全部") {
          desc = `${year}年，不限院系`;
        } else {
          desc = `${year}年，${dept}`;
        }
        this.form.year = year === "全部" ? "" : year;
        this.form.department = dept === "全部" ? "" : dept;
        this.form.departmentDesc = desc;
        this.departmentIndex = e.index;
      }
    },
    // 居住地选择回调
    onResidenceChange(e) {
      common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:411", "选择居住地", e);
      this.closePicker("residence");
      if (e && e.text && e.value) {
        const path = e.text.join(",");
        const codes = e.value.join(",");
        this.form.residence = codes;
        this.form.residenceDesc = path;
        this.residenceIndex = e.index;
      }
    },
    // 行业选择回调
    onIndustryChange(e) {
      common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:427", "选择行业", e);
      this.closePicker("industry");
      common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:431", "行业选择回调数据:", JSON.stringify(e));
      if (e && e.index && Array.isArray(e.index)) {
        const index = e.index[0] || 0;
        const selected = industryList[index];
        if (selected) {
          this.form.industry = selected.code;
          this.form.industryDesc = selected.name;
          this.industryIndex = e.index;
          common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:445", "已选择行业:", selected.name, selected.code);
        }
      }
    },
    // 切换距离排序
    toggleSortByDistance(e) {
      this.form.sortByDistance = e.detail.value;
      if (this.form.sortByDistance) {
        this.requestLocationPermission();
      }
    },
    // 启用位置排序
    enableLocationSort() {
      this.form.sortByDistance = true;
      this.requestLocationPermission();
    },
    // 请求位置权限
    requestLocationPermission() {
      getUserLocation().then((location) => {
        common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:468", "位置信息获取成功", location);
        this.form.latitude = location.latitude;
        this.form.longitude = location.longitude;
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/discoverAlumniPage/discoverAlumniPage.vue:474", "位置信息获取失败", err);
        this.form.sortByDistance = false;
        common_vendor.index.showToast({
          title: "获取位置信息失败，无法按距离排序",
          icon: "none"
        });
      });
    },
    // 搜索校友
    searchAlumni() {
      common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:485", "搜索条件:", this.form);
      saveSearchHistory(this.form);
      this.searchState = "loading";
      searchAlumni(this.form).then((res) => {
        common_vendor.index.__f__("log", "at pages/discoverAlumniPage/discoverAlumniPage.vue:496", "搜索结果:", res);
        setTimeout(() => {
          this.searchResults = mockSearchResults;
          if (this.searchResults.total > 0) {
            this.searchState = "hasResult";
          } else {
            this.searchState = "noResult";
          }
        }, 1e3);
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/discoverAlumniPage/discoverAlumniPage.vue:512", "搜索失败", err);
        this.searchState = "noResult";
        common_vendor.index.showToast({
          title: "搜索失败，请重试",
          icon: "none"
        });
      });
    },
    // 切换收藏状态
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      this.isStarAnimating = true;
      setTimeout(() => {
        this.isStarAnimating = false;
      }, 300);
      common_vendor.index.showToast({
        title: this.isFavorite ? "已收藏" : "取消收藏",
        icon: "none"
      });
    }
  }
};
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_fui_switch2 = common_vendor.resolveComponent("fui-switch");
  const _easycom_fui_loading2 = common_vendor.resolveComponent("fui-loading");
  const _easycom_fui_picker2 = common_vendor.resolveComponent("fui-picker");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_fui_switch2 + _easycom_fui_loading2 + _easycom_fui_picker2)();
}
const _easycom_fui_icon = () => "../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_fui_switch = () => "../../components/firstui/fui-switch/fui-switch.js";
const _easycom_fui_loading = () => "../../components/firstui/fui-loading/fui-loading.js";
const _easycom_fui_picker = () => "../../components/firstui/fui-picker/fui-picker.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar + _easycom_fui_switch + _easycom_fui_loading + _easycom_fui_picker)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      name: "arrowleft",
      color: "#333",
      size: 36
    }),
    b: common_vendor.o($options.goBack),
    c: common_vendor.p({
      title: "发现校友",
      background: "#F0F4F8",
      color: "#333333",
      fontWeight: "bold",
      splitLine: true,
      isFixed: true,
      isOccupy: true
    }),
    d: common_vendor.n($data.currentTab === "search" ? "tab-active" : ""),
    e: common_vendor.o(($event) => $options.switchTab("search")),
    f: common_vendor.n($data.currentTab === "classmates" ? "tab-active" : ""),
    g: common_vendor.o(($event) => $options.switchTab("classmates")),
    h: $data.currentTab === "search"
  }, $data.currentTab === "search" ? common_vendor.e({
    i: $data.form.name,
    j: common_vendor.o(($event) => $data.form.name = $event.detail.value),
    k: common_vendor.t($data.form.schoolTypeDesc || "不限"),
    l: common_vendor.p({
      name: "right",
      size: 32
    }),
    m: common_vendor.o(($event) => $options.showPicker("schoolType")),
    n: common_vendor.t($data.form.departmentDesc || "不限年份，不限院系"),
    o: common_vendor.p({
      name: "right",
      size: 32
    }),
    p: common_vendor.o(($event) => $options.showPicker("department")),
    q: common_vendor.t($data.form.residenceDesc || "选填 一级：大洲/国家/省/市/地"),
    r: common_vendor.p({
      name: "right",
      size: 32
    }),
    s: common_vendor.o(($event) => $options.showPicker("residence")),
    t: common_vendor.t($data.form.industryDesc || "不限"),
    v: common_vendor.p({
      name: "right",
      size: 32
    }),
    w: common_vendor.o(($event) => $options.showPicker("industry")),
    x: $data.form.company,
    y: common_vendor.o(($event) => $data.form.company = $event.detail.value),
    z: common_vendor.o($options.toggleSortByDistance),
    A: common_vendor.p({
      checked: $data.form.sortByDistance,
      color: "#004299",
      background: "#f1f1f1",
      scaleRatio: 0.9
    }),
    B: !$data.form.sortByDistance
  }, !$data.form.sortByDistance ? {
    C: common_vendor.o((...args) => $options.enableLocationSort && $options.enableLocationSort(...args))
  } : {}, {
    D: common_vendor.o((...args) => $options.searchAlumni && $options.searchAlumni(...args)),
    E: $data.searchState !== "initial"
  }, $data.searchState !== "initial" ? common_vendor.e({
    F: $data.searchState === "loading"
  }, $data.searchState === "loading" ? {
    G: common_vendor.p({
      type: "col",
      text: "搜索中..."
    })
  } : $data.searchState === "noResult" ? {
    I: common_vendor.p({
      name: "search",
      size: 80
    })
  } : $data.searchState === "hasResult" ? {
    K: common_vendor.f($data.searchResults.list, (item, index, i0) => {
      return common_vendor.e({
        a: item.avatar,
        b: common_vendor.t(item.name)
      }, $data.form.sortByDistance ? {
        c: common_vendor.t(item.distance)
      } : {}, {
        d: common_vendor.t(item.enrollYear),
        e: common_vendor.t(item.department),
        f: common_vendor.t(item.industry),
        g: common_vendor.t(item.company),
        h: common_vendor.t(item.residence),
        i: common_vendor.o(($event) => $options.addFriend(item.id), item.id),
        j: item.id
      });
    }),
    L: $data.form.sortByDistance
  } : {}, {
    H: $data.searchState === "noResult",
    J: $data.searchState === "hasResult"
  }) : {}) : $data.currentTab === "classmates" ? {
    N: common_vendor.f($data.classmatesData.list, (item, index, i0) => {
      return {
        a: item.avatar,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.enrollYear),
        d: common_vendor.t(item.specialty),
        e: item.id
      };
    })
  } : {}, {
    M: $data.currentTab === "classmates",
    O: common_vendor.p({
      name: "star",
      color: $data.isFavorite ? "#FFCC00" : "#C0C0C0",
      size: 50
    }),
    P: $data.isStarAnimating ? 1 : "",
    Q: common_vendor.o((...args) => $options.toggleFavorite && $options.toggleFavorite(...args)),
    R: common_vendor.o($options.onSchoolTypeChange),
    S: common_vendor.o(() => $options.closePicker("schoolType")),
    T: common_vendor.p({
      options: $data.pickerOptions.schoolType,
      show: $data.pickerShow.schoolType,
      title: "选择入校类型",
      confirmColor: "#004299",
      value: $data.schoolTypeIndex
    }),
    U: common_vendor.o($options.onDepartmentChange),
    V: common_vendor.o(() => $options.closePicker("department")),
    W: common_vendor.p({
      layer: 2,
      options: $data.pickerOptions.department,
      show: $data.pickerShow.department,
      title: "选择入校院系",
      confirmColor: "#004299",
      value: $data.departmentIndex
    }),
    X: common_vendor.o($options.onResidenceChange),
    Y: common_vendor.o(() => $options.closePicker("residence")),
    Z: common_vendor.p({
      linkage: true,
      layer: 3,
      options: $data.pickerOptions.residence,
      show: $data.pickerShow.residence,
      title: "选择居住地",
      confirmColor: "#004299",
      value: $data.residenceIndex,
      fields: ["text", "value", "children"]
    }),
    aa: common_vendor.o($options.onIndustryChange),
    ab: common_vendor.o(() => $options.closePicker("industry")),
    ac: common_vendor.p({
      options: $data.pickerOptions.industry,
      show: $data.pickerShow.industry,
      title: "选择行业",
      confirmColor: "#004299",
      value: $data.industryIndex
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/discoverAlumniPage/discoverAlumniPage.js.map

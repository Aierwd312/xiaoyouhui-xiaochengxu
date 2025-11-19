"use strict";
const common_vendor = require("../../common/vendor.js");
const archiveQueryPageJs = {
  data() {
    return {
      // 导航栏配置
      navBackground: "#004299",
      // 导航栏背景色 - 重财蓝
      navTitleColor: "#FFFFFF",
      // 导航栏标题颜色 - 白色
      primaryColor: "#004299",
      // 主题色 - 重财蓝
      // 档案类型数据
      archiveTypes: [
        {
          type: "transcript",
          name: "成绩单",
          icon: "file-list-3-line",
          color: "#2A6DCF",
          description: "在校期间的成绩记录"
        },
        {
          type: "diploma",
          name: "学历证明",
          icon: "bookmark-3-line",
          color: "#FF9800",
          description: "毕业证书、学位证明等"
        },
        {
          type: "awards",
          name: "获奖记录",
          icon: "award-line",
          color: "#4CAF50",
          description: "在校期间获得的各类奖项"
        },
        {
          type: "activity",
          name: "社团活动",
          icon: "team-line",
          color: "#79A6DC",
          description: "参与过的社团和活动记录"
        },
        {
          type: "status",
          name: "学籍信息",
          icon: "profile-line",
          color: "#FF5722",
          description: "在校学籍状态记录"
        },
        {
          type: "other",
          name: "其他材料",
          icon: "folder-5-line",
          color: "#333333",
          description: "其他类型的档案材料"
        }
      ],
      // 选择器数据
      semesterOptions: [
        { value: "all", text: "全部学期" },
        { value: "year1", text: "第一学年" },
        { value: "year2", text: "第二学年" },
        { value: "year3", text: "第三学年" },
        { value: "year4", text: "第四学年" },
        { value: "2025-2026-1", text: "2025-2026学年第一学期" },
        { value: "2025-2026-2", text: "2025-2026学年第二学期" },
        { value: "2026-2027-1", text: "2026-2027学年第一学期" },
        { value: "2026-2027-2", text: "2026-2027学年第二学期" }
      ],
      purposeOptions: [
        { value: "further_study", text: "升学" },
        { value: "employment", text: "就业" },
        { value: "personal", text: "个人存档" },
        { value: "other", text: "其他" }
      ],
      receiveMethodOptions: [
        { value: "electronic", text: "电子档" },
        { value: "paper", text: "纸质档(邮寄)" },
        { value: "both", text: "两者都需要" }
      ],
      // 当前选择的档案类型
      selectedType: null,
      // 表单数据
      formData: {
        name: "",
        // 姓名（自动填充）
        studentId: "",
        // 学号（自动填充）
        enrollmentYear: "",
        // 入学年份（自动填充）
        department: "",
        // 院系（自动填充）
        semester: "",
        // 查询学期值
        semesterText: "",
        // 查询学期显示文本
        purpose: "",
        // 用途值
        purposeText: "",
        // 用途显示文本
        receiveMethod: "",
        // 接收方式值
        receiveMethodText: "",
        // 接收方式显示文本
        remarks: "",
        // 备注
        phone: "",
        // 联系电话（自动填充但可修改）
        address: ""
        // 邮寄地址（仅纸质档显示）
      },
      // 选择器配置
      pickerConfig: {
        show: false,
        // 是否显示选择器
        options: [],
        // 选择器选项
        currentField: ""
        // 当前操作的字段
      },
      // 历史申请记录数据
      historyRequests: [],
      isHistoryExpanded: true,
      // 默认展开历史记录
      isHistoryLoading: false,
      // 历史记录加载状态
      // 状态控制
      isLoading: false,
      // 加载状态
      showSuccess: false
      // 是否显示成功页面
    };
  },
  onLoad() {
    this.isLoading = false;
    this.isHistoryLoading = false;
    this.fetchUserInfo();
    this.fetchHistoryRequests();
  },
  onShow() {
    this.isLoading = false;
    this.isHistoryLoading = false;
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
     * 获取用户基本信息
     */
    async fetchUserInfo() {
      try {
        this.isLoading = true;
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.formData.name = "张三";
        this.formData.studentId = "202512345";
        this.formData.enrollmentYear = "2025";
        this.formData.department = "会计学院";
        this.formData.phone = "13800138000";
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:161", "获取用户信息失败:", error);
        common_vendor.index.showToast({
          title: "获取用户信息失败",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * 获取历史申请记录
     */
    async fetchHistoryRequests() {
      try {
        this.isHistoryLoading = true;
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        this.historyRequests = [
          {
            id: "req001",
            type: "transcript",
            typeName: "成绩单",
            status: "completed",
            statusText: "已完成",
            applyDate: "2025-09-15 14:30",
            isExpanded: false,
            // 控制展开状态
            details: {
              semester: "2025-2026学年第一学期",
              purpose: "升学",
              receiveMethod: "电子档",
              remarks: ""
            },
            resultUrl: "https://example.com/results/transcript_001.pdf",
            processingTime: "2025-09-16 10:25"
          },
          {
            id: "req002",
            type: "diploma",
            typeName: "学历证明",
            status: "processing",
            statusText: "处理中",
            applyDate: "2025-09-20 11:45",
            isExpanded: false,
            details: {
              purpose: "就业",
              receiveMethod: "纸质档(邮寄)",
              address: "重庆市南岸区学府大道19号 邮编: 400000",
              remarks: "需要加盖学校公章"
            }
          },
          {
            id: "req003",
            type: "awards",
            typeName: "获奖记录",
            status: "pending",
            statusText: "待处理",
            applyDate: "2025-09-22 16:20",
            isExpanded: false,
            details: {
              purpose: "个人存档",
              receiveMethod: "电子档",
              remarks: "包含所有奖学金及竞赛获奖情况"
            }
          },
          {
            id: "req004",
            type: "status",
            typeName: "学籍信息",
            status: "rejected",
            statusText: "已拒绝",
            applyDate: "2025-09-10 09:15",
            isExpanded: false,
            details: {
              purpose: "其他",
              receiveMethod: "电子档",
              remarks: "需要完整的学籍变动记录"
            },
            rejectReason: "申请信息不完整，请重新提交并说明具体需要的学籍信息内容"
          }
        ];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:246", "获取历史记录失败:", error);
        common_vendor.index.showToast({
          title: "获取历史记录失败",
          icon: "none"
        });
      } finally {
        this.isHistoryLoading = false;
      }
    },
    /**
     * 选择档案类型
     */
    selectArchiveType(item) {
      this.selectedType = item.type;
      this.formData.semester = "";
      this.formData.semesterText = "";
      this.formData.purpose = "";
      this.formData.purposeText = "";
      this.formData.receiveMethod = "";
      this.formData.receiveMethodText = "";
      this.formData.address = "";
      this.formData.remarks = "";
      setTimeout(() => {
        common_vendor.index.pageScrollTo({
          selector: ".form-section",
          duration: 300
        });
      }, 100);
    },
    /**
     * 打开学期选择器
     */
    showSemesterPicker() {
      this.pickerConfig = {
        show: true,
        options: this.semesterOptions,
        currentField: "semester"
      };
    },
    /**
     * 打开用途选择器
     */
    showPurposePicker() {
      this.pickerConfig = {
        show: true,
        options: this.purposeOptions,
        currentField: "purpose"
      };
    },
    /**
     * 打开接收方式选择器
     */
    showReceiveMethodPicker() {
      this.pickerConfig = {
        show: true,
        options: this.receiveMethodOptions,
        currentField: "receiveMethod"
      };
    },
    /**
     * 关闭选择器
     */
    closePicker() {
      this.pickerConfig.show = false;
    },
    /**
     * 选择器确认选择
     */
    onPickerConfirm(e) {
      try {
        const { value, text } = e.item[0];
        const field = this.pickerConfig.currentField;
        if (field === "semester") {
          this.formData.semester = value;
          this.formData.semesterText = text;
        } else if (field === "purpose") {
          this.formData.purpose = value;
          this.formData.purposeText = text;
        } else if (field === "receiveMethod") {
          this.formData.receiveMethod = value;
          this.formData.receiveMethodText = text;
        }
        this.closePicker();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:343", "选择器确认选择错误:", error);
        common_vendor.index.showToast({
          title: "选择出错，请重试",
          icon: "none"
        });
        this.closePicker();
      }
    },
    /**
     * 切换历史记录区域展开/折叠
     */
    toggleHistory() {
      this.isHistoryExpanded = !this.isHistoryExpanded;
    },
    /**
     * 切换记录详情展开/折叠
     */
    toggleRecordDetail(index) {
      this.historyRequests[index].isExpanded = !this.historyRequests[index].isExpanded;
    },
    /**
     * 根据类型获取图标
     */
    getIconByType(type) {
      const typeItem = this.archiveTypes.find((item) => item.type === type);
      return typeItem ? typeItem.icon : "file-list-3-line";
    },
    /**
     * 根据类型获取颜色
     */
    getColorByType(type) {
      const typeItem = this.archiveTypes.find((item) => item.type === type);
      return typeItem ? typeItem.color : "#333333";
    },
    /**
     * 获取详情字段标签
     */
    getDetailLabel(key) {
      const labelMap = {
        "semester": "查询学期",
        "purpose": "用途说明",
        "receiveMethod": "接收方式",
        "address": "邮寄地址",
        "remarks": "其他说明"
      };
      return labelMap[key] || key;
    },
    /**
     * 下载查询结果
     */
    async downloadResult(recordId) {
      try {
        const record = this.historyRequests.find((item) => item.id === recordId);
        if (!record || !record.resultUrl) {
          common_vendor.index.showToast({
            title: "下载链接无效",
            icon: "none"
          });
          return;
        }
        common_vendor.index.showLoading({
          title: "下载中...",
          mask: true
        });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "下载成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:429", "下载结果错误:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "下载失败，请重试",
          icon: "none"
        });
      }
    },
    /**
     * 提交表单
     */
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }
      try {
        this.isLoading = true;
        await new Promise((resolve) => setTimeout(resolve, 1500));
        this.showSuccess = true;
        this.resetForm();
        this.fetchHistoryRequests();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:461", "提交表单错误:", error);
        common_vendor.index.showToast({
          title: "提交失败，请重试",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * 表单验证
     */
    validateForm() {
      try {
        if (this.selectedType === "transcript" && !this.formData.semester) {
          common_vendor.index.showToast({
            title: "请选择查询学期",
            icon: "none"
          });
          return false;
        }
        if (!this.formData.purpose) {
          common_vendor.index.showToast({
            title: "请选择用途说明",
            icon: "none"
          });
          return false;
        }
        if (!this.formData.receiveMethod) {
          common_vendor.index.showToast({
            title: "请选择接收方式",
            icon: "none"
          });
          return false;
        }
        if ((this.formData.receiveMethod === "paper" || this.formData.receiveMethod === "both") && !this.formData.address) {
          common_vendor.index.showToast({
            title: "请输入邮寄地址",
            icon: "none"
          });
          return false;
        }
        if (!this.formData.phone) {
          common_vendor.index.showToast({
            title: "请输入联系电话",
            icon: "none"
          });
          return false;
        }
        const phoneReg = /^1[3-9]\d{9}$/;
        if (!phoneReg.test(this.formData.phone)) {
          common_vendor.index.showToast({
            title: "请输入正确的手机号",
            icon: "none"
          });
          return false;
        }
        return true;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:531", "表单验证错误:", error);
        return false;
      }
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.selectedType = null;
      this.formData.semester = "";
      this.formData.semesterText = "";
      this.formData.purpose = "";
      this.formData.purposeText = "";
      this.formData.receiveMethod = "";
      this.formData.receiveMethodText = "";
      this.formData.address = "";
      this.formData.remarks = "";
      common_vendor.index.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    },
    /**
     * 关闭成功提示
     */
    onSuccessClose() {
      this.showSuccess = false;
      this.fetchHistoryRequests();
    }
  }
};
const _sfc_main = {
  mixins: [archiveQueryPageJs],
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
  }
};
if (!Array) {
  const _easycom_fui_icon2 = common_vendor.resolveComponent("fui-icon");
  const _easycom_fui_nav_bar2 = common_vendor.resolveComponent("fui-nav-bar");
  const _easycom_fui_grid_item2 = common_vendor.resolveComponent("fui-grid-item");
  const _easycom_fui_grid2 = common_vendor.resolveComponent("fui-grid");
  const _easycom_fui_input2 = common_vendor.resolveComponent("fui-input");
  const _easycom_fui_form_item2 = common_vendor.resolveComponent("fui-form-item");
  const _easycom_fui_textarea2 = common_vendor.resolveComponent("fui-textarea");
  const _easycom_fui_form2 = common_vendor.resolveComponent("fui-form");
  const _easycom_fui_button2 = common_vendor.resolveComponent("fui-button");
  const _easycom_fui_loadmore2 = common_vendor.resolveComponent("fui-loadmore");
  const _easycom_fui_picker2 = common_vendor.resolveComponent("fui-picker");
  const _easycom_fui_loading2 = common_vendor.resolveComponent("fui-loading");
  const _easycom_fui_dialog2 = common_vendor.resolveComponent("fui-dialog");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_fui_grid_item2 + _easycom_fui_grid2 + _easycom_fui_input2 + _easycom_fui_form_item2 + _easycom_fui_textarea2 + _easycom_fui_form2 + _easycom_fui_button2 + _easycom_fui_loadmore2 + _easycom_fui_picker2 + _easycom_fui_loading2 + _easycom_fui_dialog2)();
}
const _easycom_fui_icon = () => "../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_fui_grid_item = () => "../../components/firstui/fui-grid-item/fui-grid-item.js";
const _easycom_fui_grid = () => "../../components/firstui/fui-grid/fui-grid.js";
const _easycom_fui_input = () => "../../components/firstui/fui-input/fui-input.js";
const _easycom_fui_form_item = () => "../../components/firstui/fui-form-item/fui-form-item.js";
const _easycom_fui_textarea = () => "../../components/firstui/fui-textarea/fui-textarea.js";
const _easycom_fui_form = () => "../../components/firstui/fui-form/fui-form.js";
const _easycom_fui_button = () => "../../components/firstui/fui-button/fui-button.js";
const _easycom_fui_loadmore = () => "../../components/firstui/fui-loadmore/fui-loadmore.js";
const _easycom_fui_picker = () => "../../components/firstui/fui-picker/fui-picker.js";
const _easycom_fui_loading = () => "../../components/firstui/fui-loading/fui-loading.js";
const _easycom_fui_dialog = () => "../../components/firstui/fui-dialog/fui-dialog.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar + _easycom_fui_grid_item + _easycom_fui_grid + _easycom_fui_input + _easycom_fui_form_item + _easycom_fui_textarea + _easycom_fui_form + _easycom_fui_button + _easycom_fui_loadmore + _easycom_fui_picker + _easycom_fui_loading + _easycom_fui_dialog)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      name: "arrowleft",
      color: _ctx.navTitleColor,
      size: 36
    }),
    b: common_vendor.o($setup.navbarInit),
    c: common_vendor.o(_ctx.goBack),
    d: common_vendor.p({
      title: "档案查询",
      background: _ctx.navBackground,
      color: _ctx.navTitleColor,
      fontWeight: "bold",
      splitLine: true,
      isFixed: true,
      isOccupy: true
    }),
    e: common_vendor.f(_ctx.archiveTypes, (item, index, i0) => {
      return {
        a: "5a125220-4-" + i0 + "," + ("5a125220-3-" + i0),
        b: common_vendor.p({
          name: item.icon,
          color: item.color,
          size: 48
        }),
        c: common_vendor.t(item.name),
        d: _ctx.selectedType === item.type ? 1 : "",
        e: index,
        f: common_vendor.o(($event) => _ctx.selectArchiveType(item), index),
        g: "5a125220-3-" + i0 + ",5a125220-2"
      };
    }),
    f: common_vendor.p({
      columns: 3,
      showBorder: false
    }),
    g: _ctx.selectedType
  }, _ctx.selectedType ? common_vendor.e({
    h: common_vendor.o(($event) => _ctx.formData.name = $event),
    i: common_vendor.p({
      disabled: true,
      placeholder: "已自动填充",
      modelValue: _ctx.formData.name
    }),
    j: common_vendor.p({
      label: "姓名",
      required: true,
      asterisk: true
    }),
    k: common_vendor.o(($event) => _ctx.formData.studentId = $event),
    l: common_vendor.p({
      disabled: true,
      placeholder: "已自动填充",
      modelValue: _ctx.formData.studentId
    }),
    m: common_vendor.p({
      label: "学号",
      required: true,
      asterisk: true
    }),
    n: common_vendor.o(($event) => _ctx.formData.enrollmentYear = $event),
    o: common_vendor.p({
      disabled: true,
      placeholder: "已自动填充",
      modelValue: _ctx.formData.enrollmentYear
    }),
    p: common_vendor.p({
      label: "入学年份",
      required: true,
      asterisk: true
    }),
    q: common_vendor.o(($event) => _ctx.formData.department = $event),
    r: common_vendor.p({
      disabled: true,
      placeholder: "已自动填充",
      modelValue: _ctx.formData.department
    }),
    s: common_vendor.p({
      label: "所属院系",
      required: true,
      asterisk: true
    }),
    t: _ctx.selectedType === "transcript"
  }, _ctx.selectedType === "transcript" ? {
    v: common_vendor.o(_ctx.showSemesterPicker),
    w: common_vendor.o(($event) => _ctx.formData.semesterText = $event),
    x: common_vendor.p({
      placeholder: "请选择需查询的学期",
      disabled: true,
      rightIcon: "right",
      modelValue: _ctx.formData.semesterText
    }),
    y: common_vendor.p({
      label: "查询学期",
      required: true,
      asterisk: true
    })
  } : {}, {
    z: common_vendor.o(_ctx.showPurposePicker),
    A: common_vendor.o(($event) => _ctx.formData.purposeText = $event),
    B: common_vendor.p({
      placeholder: "请选择申请用途",
      disabled: true,
      rightIcon: "right",
      modelValue: _ctx.formData.purposeText
    }),
    C: common_vendor.p({
      label: "用途说明",
      required: true,
      asterisk: true
    }),
    D: common_vendor.o(_ctx.showReceiveMethodPicker),
    E: common_vendor.o(($event) => _ctx.formData.receiveMethodText = $event),
    F: common_vendor.p({
      placeholder: "请选择结果接收方式",
      disabled: true,
      rightIcon: "right",
      modelValue: _ctx.formData.receiveMethodText
    }),
    G: common_vendor.p({
      label: "接收方式",
      required: true,
      asterisk: true
    }),
    H: _ctx.formData.receiveMethod === "paper" || _ctx.formData.receiveMethod === "both"
  }, _ctx.formData.receiveMethod === "paper" || _ctx.formData.receiveMethod === "both" ? {
    I: common_vendor.o(($event) => _ctx.formData.address = $event),
    J: common_vendor.p({
      placeholder: "请输入接收纸质材料的地址",
      maxlength: 100,
      modelValue: _ctx.formData.address
    }),
    K: common_vendor.p({
      label: "邮寄地址",
      required: true,
      asterisk: true
    })
  } : {}, {
    L: common_vendor.o(($event) => _ctx.formData.phone = $event),
    M: common_vendor.p({
      placeholder: "请输入接收结果的联系电话",
      type: "number",
      modelValue: _ctx.formData.phone
    }),
    N: common_vendor.p({
      label: "联系电话",
      required: true,
      asterisk: true
    }),
    O: common_vendor.o(($event) => _ctx.formData.remarks = $event),
    P: common_vendor.p({
      placeholder: "请输入其他需说明的信息（选填）",
      maxlength: 200,
      modelValue: _ctx.formData.remarks
    }),
    Q: common_vendor.p({
      label: "其他说明"
    }),
    R: common_vendor.o(_ctx.submitForm),
    S: common_vendor.p({
      type: "primary",
      background: _ctx.primaryColor,
      loading: _ctx.isLoading,
      disabled: _ctx.isLoading
    })
  }) : {}, {
    T: common_vendor.p({
      name: _ctx.isHistoryExpanded ? "up" : "down",
      size: 32,
      color: "#666"
    }),
    U: common_vendor.o((...args) => _ctx.toggleHistory && _ctx.toggleHistory(...args)),
    V: _ctx.isHistoryExpanded
  }, _ctx.isHistoryExpanded ? common_vendor.e({
    W: _ctx.isHistoryLoading
  }, _ctx.isHistoryLoading ? {
    X: common_vendor.p({
      text: "加载中...",
      iconColor: "#004299"
    })
  } : _ctx.historyRequests.length === 0 ? {
    Z: common_vendor.p({
      name: "file-search-line",
      size: 64,
      color: "#CCCCCC"
    })
  } : {
    aa: common_vendor.f(_ctx.historyRequests, (record, index, i0) => {
      return common_vendor.e({
        a: "5a125220-30-" + i0,
        b: common_vendor.p({
          name: _ctx.getIconByType(record.type),
          color: _ctx.getColorByType(record.type),
          size: 36
        }),
        c: common_vendor.t(record.typeName),
        d: common_vendor.t(record.statusText),
        e: common_vendor.n("status-" + record.status),
        f: common_vendor.t(record.applyDate),
        g: record.isExpanded
      }, record.isExpanded ? common_vendor.e({
        h: _ctx.value
      }, _ctx.value ? {
        i: common_vendor.f(record.details, (value, key, i1) => {
          return {
            a: common_vendor.t(_ctx.getDetailLabel(key)),
            b: common_vendor.t(value),
            c: key
          };
        })
      } : {}, {
        j: record.processingTime
      }, record.processingTime ? {
        k: common_vendor.t(record.processingTime)
      } : {}, {
        l: record.status === "completed"
      }, record.status === "completed" ? {
        m: common_vendor.o(($event) => _ctx.downloadResult(record.id), record.id),
        n: "5a125220-31-" + i0,
        o: common_vendor.p({
          type: "primary",
          background: _ctx.primaryColor,
          size: "medium"
        })
      } : {}, {
        p: record.status === "rejected" && record.rejectReason
      }, record.status === "rejected" && record.rejectReason ? {
        q: common_vendor.t(record.rejectReason)
      } : {}) : {}, {
        r: record.id,
        s: common_vendor.o(($event) => _ctx.toggleRecordDetail(index), record.id)
      });
    })
  }, {
    Y: _ctx.historyRequests.length === 0
  }) : {}, {
    ab: $setup.navHeight + "px",
    ac: common_vendor.o(_ctx.onPickerConfirm),
    ad: common_vendor.o(_ctx.closePicker),
    ae: common_vendor.p({
      show: _ctx.pickerConfig.show,
      options: _ctx.pickerConfig.options
    }),
    af: common_vendor.p({
      show: _ctx.isLoading && !_ctx.isHistoryLoading,
      type: "col",
      text: "处理中..."
    }),
    ag: common_vendor.o(_ctx.onSuccessClose),
    ah: common_vendor.p({
      show: _ctx.showSuccess,
      title: "申请提交成功",
      content: "您的档案查询申请已成功提交，请耐心等待处理结果",
      buttonColor: "#004299"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/archiveQueryPage/archiveQueryPage.js.map

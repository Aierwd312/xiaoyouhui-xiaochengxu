"use strict";
const common_vendor = require("../../common/vendor.js");
const api_archives = require("../../api/archives.js");
const store_index = require("../../store/index.js");
const common_assets = require("../../common/assets.js");
const archiveQueryPageJs = {
  data() {
    return {
      navBackground: "#004299",
      navTitleColor: "#FFFFFF",
      primaryColor: "#004299",
      applications: [],
      formData: {
        title: "",
        applicationFile: "",
        applicationReason: "",
        applicationAnnexes: "",
        sendType: "",
        sendTypeText: "",
        email: "",
        address: "",
        phone: "",
        remark: ""
      },
      sendTypeOptions: ["电子档", "纸质档(邮寄)", "两者都需要"],
      sendTypeMap: {
        "电子档": "0",
        "纸质档(邮寄)": "1",
        "两者都需要": "2"
      },
      sendTypeReverseMap: {
        "0": "email",
        "1": "paper",
        "2": "both"
      },
      pickerConfig: {
        show: false,
        options: [],
        currentField: ""
      },
      isLoading: false,
      isSubmitting: false,
      showFormPopup: false,
      formMode: "add",
      currentEditId: null
    };
  },
  onLoad() {
    this.loadApplications();
  },
  onShow() {
    this.loadApplications();
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    async loadApplications() {
      try {
        this.isLoading = true;
        const userInfo = store_index.store.getters.userInfo || {};
        const userId = userInfo.userId || userInfo.id;
        common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:72", "=== 加载档案申请列表 ===");
        common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:73", "用户信息:", userInfo);
        common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:74", "用户ID:", userId);
        const queryParams = userId ? { applicant: userId } : {};
        common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:78", "查询参数:", queryParams);
        const response = await api_archives.getArchiveApplicationList(queryParams);
        common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:80", "API响应:", response);
        if (response && response.code === 200) {
          if (response.rows && Array.isArray(response.rows)) {
            this.applications = response.rows.map((item) => {
              const originalStatus = item.status;
              return {
                ...item,
                status: this.mapStatus(originalStatus),
                statusText: this.getStatusText(originalStatus)
              };
            });
            common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:92", "处理后的申请列表:", this.applications);
            common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:93", "总记录数:", response.total);
          } else {
            this.applications = [];
            common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:96", "无申请记录");
          }
        } else {
          this.applications = [];
          const errorMsg = (response == null ? void 0 : response.msg) || "获取列表失败";
          common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:101", "API响应错误:", errorMsg);
          common_vendor.index.showToast({
            title: errorMsg,
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:108", "加载申请列表失败:", error);
        this.applications = [];
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
      }
    },
    showApplicationForm() {
      this.formMode = "add";
      this.currentEditId = null;
      this.resetFormData();
      const userInfo = store_index.store.getters.userInfo || {};
      this.formData.phone = userInfo.phonenumber || userInfo.phone || "";
      this.formData.email = userInfo.email || "";
      this.showFormPopup = true;
    },
    closeFormPopup() {
      this.showFormPopup = false;
      this.resetFormData();
    },
    resetFormData() {
      this.formData = {
        title: "",
        applicationFile: "",
        applicationReason: "",
        applicationAnnexes: "",
        sendType: "",
        sendTypeText: "",
        email: "",
        address: "",
        phone: "",
        remark: ""
      };
    },
    showSendTypePicker() {
      this.pickerConfig = {
        show: true,
        options: this.sendTypeOptions,
        currentField: "sendType"
      };
    },
    closePicker() {
      this.pickerConfig.show = false;
    },
    onPickerConfirm(e) {
      try {
        const selectedText = e.text;
        const selectedValue = this.sendTypeMap[selectedText];
        this.closePicker();
        setTimeout(() => {
          this.formData.sendTypeText = selectedText;
          this.formData.sendType = selectedValue;
        }, 150);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:171", "选择器确认错误:", error);
        this.closePicker();
      }
    },
    downloadResult(recordId) {
      const record = this.applications.find((item) => item.id === recordId);
      if (!record || !record.resultUrl) {
        common_vendor.index.showToast({
          title: "暂无可下载文件",
          icon: "none"
        });
        return;
      }
      common_vendor.index.downloadFile({
        url: record.resultUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            const filePath = res.tempFilePath;
            common_vendor.index.saveFile({
              tempFilePath: filePath,
              success: (saveRes) => {
                common_vendor.index.showToast({
                  title: "下载成功",
                  icon: "success"
                });
              },
              fail: () => {
                common_vendor.index.showToast({
                  title: "保存失败",
                  icon: "none"
                });
              }
            });
          }
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:208", "下载失败:", error);
          common_vendor.index.showToast({
            title: "下载失败",
            icon: "none"
          });
        }
      });
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }
      try {
        this.isSubmitting = true;
        const submitData = {
          title: this.formData.title,
          applicationFile: this.formData.applicationFile,
          applicationReason: this.formData.applicationReason,
          applicationAnnexes: this.formData.applicationAnnexes || "",
          sendType: this.formData.sendType,
          email: this.formData.email || "",
          address: this.formData.address || "",
          phone: this.formData.phone,
          remark: this.formData.remark || ""
        };
        if (this.formMode === "edit" && this.currentEditId) {
          submitData.id = this.currentEditId;
          common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:237", "调用编辑API:", submitData);
          const response = await api_archives.updateArchiveApplication(submitData);
          common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:239", "编辑API响应:", response);
          common_vendor.index.showToast({
            title: "修改成功",
            icon: "success"
          });
        } else {
          common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:245", "调用新增API:", submitData);
          const response = await api_archives.addArchiveApplication(submitData);
          common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:247", "新增API响应:", response);
          common_vendor.index.showToast({
            title: "提交成功",
            icon: "success"
          });
        }
        this.closeFormPopup();
        this.loadApplications();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:256", "提交错误:", error);
        common_vendor.index.showToast({
          title: this.formMode === "edit" ? "修改失败" : "提交失败",
          icon: "none"
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    validateForm() {
      if (!this.formData.title) {
        common_vendor.index.showToast({
          title: "请输入申请标题",
          icon: "none"
        });
        return false;
      }
      if (!this.formData.applicationFile) {
        common_vendor.index.showToast({
          title: "请输入申请材料名称",
          icon: "none"
        });
        return false;
      }
      if (!this.formData.applicationReason) {
        common_vendor.index.showToast({
          title: "请输入申请原因",
          icon: "none"
        });
        return false;
      }
      if (!this.formData.sendType) {
        common_vendor.index.showToast({
          title: "请选择接收方式",
          icon: "none"
        });
        return false;
      }
      if ((this.formData.sendType === "0" || this.formData.sendType === "2") && !this.formData.email) {
        common_vendor.index.showToast({
          title: "请输入电子邮箱",
          icon: "none"
        });
        return false;
      }
      if (this.formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
        common_vendor.index.showToast({
          title: "请输入正确的邮箱格式",
          icon: "none"
        });
        return false;
      }
      if ((this.formData.sendType === "1" || this.formData.sendType === "2") && !this.formData.address) {
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
    },
    editApplication(app) {
      this.formMode = "edit";
      this.currentEditId = app.id;
      const sendTypeText = Object.keys(this.sendTypeMap).find((key) => this.sendTypeMap[key] === app.sendType) || "";
      this.formData = {
        title: app.title || "",
        applicationFile: app.applicationFile || "",
        applicationReason: app.applicationReason || "",
        applicationAnnexes: app.applicationAnnexes || "",
        sendType: app.sendType || "",
        sendTypeText,
        email: app.email || "",
        address: app.address || "",
        phone: app.phone || "",
        remark: app.remark || ""
      };
      this.showFormPopup = true;
    },
    async withdrawApplication(appId) {
      try {
        const confirmResult = await new Promise((resolve) => {
          common_vendor.index.showModal({
            title: "确认撤回",
            content: "确定要撤回这条申请吗？",
            success: (res) => resolve(res.confirm),
            fail: () => resolve(false)
          });
        });
        if (!confirmResult)
          return;
        await api_archives.deleteArchiveApplication(appId);
        common_vendor.index.showToast({
          title: "已撤回",
          icon: "success"
        });
        this.loadApplications();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:382", "撤回失败:", error);
        common_vendor.index.showToast({
          title: "撤回失败",
          icon: "none"
        });
      }
    },
    async deleteApplication(appId) {
      try {
        const confirmResult = await new Promise((resolve) => {
          common_vendor.index.showModal({
            title: "确认删除",
            content: "确定要删除这条申请吗？删除后将无法恢复。",
            success: (res) => resolve(res.confirm),
            fail: () => resolve(false)
          });
        });
        if (!confirmResult)
          return;
        await api_archives.deleteArchiveApplication(appId);
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "success"
        });
        this.loadApplications();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:412", "删除申请错误:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "删除失败，请重试",
          icon: "none"
        });
      }
    },
    mapStatus(statusValue) {
      const statusMap = {
        "0": "pending",
        "1": "completed",
        "2": "rejected",
        "pending": "pending",
        "completed": "completed",
        "rejected": "rejected",
        "sent": "sent"
      };
      return statusMap[String(statusValue)] || "pending";
    },
    getStatusText(statusValue) {
      const textMap = {
        "0": "待审核",
        "1": "已通过",
        "2": "已拒绝",
        "pending": "待审核",
        "completed": "已通过",
        "rejected": "已拒绝",
        "sent": "已发放"
      };
      return textMap[String(statusValue)] || "待审核";
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
  const _easycom_fui_button2 = common_vendor.resolveComponent("fui-button");
  const _easycom_fui_loadmore2 = common_vendor.resolveComponent("fui-loadmore");
  const _easycom_fui_input2 = common_vendor.resolveComponent("fui-input");
  const _easycom_fui_form_item2 = common_vendor.resolveComponent("fui-form-item");
  const _easycom_fui_textarea2 = common_vendor.resolveComponent("fui-textarea");
  const _easycom_fui_form2 = common_vendor.resolveComponent("fui-form");
  const _easycom_fui_bottom_popup2 = common_vendor.resolveComponent("fui-bottom-popup");
  const _easycom_fui_picker2 = common_vendor.resolveComponent("fui-picker");
  (_easycom_fui_icon2 + _easycom_fui_nav_bar2 + _easycom_fui_button2 + _easycom_fui_loadmore2 + _easycom_fui_input2 + _easycom_fui_form_item2 + _easycom_fui_textarea2 + _easycom_fui_form2 + _easycom_fui_bottom_popup2 + _easycom_fui_picker2)();
}
const _easycom_fui_icon = () => "../../components/firstui/fui-icon/fui-icon.js";
const _easycom_fui_nav_bar = () => "../../components/firstui/fui-nav-bar/fui-nav-bar.js";
const _easycom_fui_button = () => "../../components/firstui/fui-button/fui-button.js";
const _easycom_fui_loadmore = () => "../../components/firstui/fui-loadmore/fui-loadmore.js";
const _easycom_fui_input = () => "../../components/firstui/fui-input/fui-input.js";
const _easycom_fui_form_item = () => "../../components/firstui/fui-form-item/fui-form-item.js";
const _easycom_fui_textarea = () => "../../components/firstui/fui-textarea/fui-textarea.js";
const _easycom_fui_form = () => "../../components/firstui/fui-form/fui-form.js";
const _easycom_fui_bottom_popup = () => "../../components/firstui/fui-bottom-popup/fui-bottom-popup.js";
const _easycom_fui_picker = () => "../../components/firstui/fui-picker/fui-picker.js";
if (!Math) {
  (_easycom_fui_icon + _easycom_fui_nav_bar + _easycom_fui_button + _easycom_fui_loadmore + _easycom_fui_input + _easycom_fui_form_item + _easycom_fui_textarea + _easycom_fui_form + _easycom_fui_bottom_popup + _easycom_fui_picker)();
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
      title: "档案查询申请",
      background: _ctx.navBackground,
      color: _ctx.navTitleColor,
      fontWeight: "bold",
      splitLine: true,
      isFixed: true,
      isOccupy: false
    }),
    e: common_assets._imports_0$2,
    f: common_assets._imports_1,
    g: common_vendor.p({
      name: "add",
      color: "#FFFFFF",
      size: 32
    }),
    h: common_vendor.o(_ctx.showApplicationForm),
    i: common_vendor.p({
      type: "primary",
      background: _ctx.primaryColor
    }),
    j: common_vendor.t(_ctx.applications.length),
    k: _ctx.isLoading
  }, _ctx.isLoading ? {
    l: common_vendor.p({
      text: "加载中...",
      iconColor: "#004299"
    })
  } : _ctx.applications.length === 0 ? {
    n: common_vendor.p({
      name: "file-search-line",
      size: 80,
      color: "#CCCCCC"
    })
  } : {
    o: common_vendor.f(_ctx.applications, (app, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(app.title),
        b: common_vendor.t(app.statusText),
        c: common_vendor.n("status-" + app.status),
        d: common_vendor.t(app.createTime),
        e: common_vendor.t(app.applicationFile),
        f: common_vendor.t(app.applicationReason),
        g: app.address
      }, app.address ? {
        h: common_vendor.t(app.address)
      } : {}, {
        i: app.reviewerName
      }, app.reviewerName ? {
        j: common_vendor.t(app.reviewerName)
      } : {}, {
        k: app.reviewComments
      }, app.reviewComments ? {
        l: app.status === "rejected" ? 1 : "",
        m: common_vendor.t(app.reviewComments),
        n: app.status === "rejected" ? 1 : ""
      } : {}, {
        o: app.status === "pending"
      }, app.status === "pending" ? {
        p: common_vendor.o(($event) => _ctx.editApplication(app), app.id),
        q: common_vendor.o(($event) => _ctx.withdrawApplication(app.id), app.id),
        r: common_vendor.o(($event) => _ctx.deleteApplication(app.id), app.id)
      } : {}, {
        s: app.status === "completed"
      }, app.status === "completed" ? {
        t: common_vendor.o(($event) => _ctx.downloadResult(app.id), app.id)
      } : {}, {
        v: app.status === "rejected"
      }, app.status === "rejected" ? {
        w: common_vendor.o(($event) => _ctx.deleteApplication(app.id), app.id)
      } : {}, {
        x: app.id
      });
    })
  }, {
    m: _ctx.applications.length === 0,
    p: $setup.navHeight + "px",
    q: common_vendor.t(_ctx.formMode === "edit" ? "编辑" : "新增"),
    r: common_vendor.o(($event) => _ctx.formData.title = $event),
    s: common_vendor.p({
      placeholder: "请输入申请标题",
      modelValue: _ctx.formData.title
    }),
    t: common_vendor.p({
      label: "申请标题",
      required: true,
      asterisk: true
    }),
    v: common_vendor.o(($event) => _ctx.formData.applicationFile = $event),
    w: common_vendor.p({
      placeholder: "请输入申请材料名称（如：成绩单）",
      modelValue: _ctx.formData.applicationFile
    }),
    x: common_vendor.p({
      label: "申请材料",
      required: true,
      asterisk: true
    }),
    y: common_vendor.o(($event) => _ctx.formData.applicationReason = $event),
    z: common_vendor.p({
      placeholder: "请输入申请原因",
      maxlength: 200,
      modelValue: _ctx.formData.applicationReason
    }),
    A: common_vendor.p({
      label: "申请原因",
      required: true,
      asterisk: true
    }),
    B: common_vendor.o(_ctx.showSendTypePicker),
    C: common_vendor.o(($event) => _ctx.formData.sendTypeText = $event),
    D: common_vendor.p({
      placeholder: "请选择接收方式",
      readonly: true,
      rightIcon: "right",
      modelValue: _ctx.formData.sendTypeText
    }),
    E: common_vendor.p({
      label: "接收方式",
      required: true,
      asterisk: true
    }),
    F: _ctx.formData.sendType === "0" || _ctx.formData.sendType === "2"
  }, _ctx.formData.sendType === "0" || _ctx.formData.sendType === "2" ? {
    G: common_vendor.o(($event) => _ctx.formData.email = $event),
    H: common_vendor.p({
      placeholder: "请输入电子邮箱",
      type: "email",
      modelValue: _ctx.formData.email
    }),
    I: common_vendor.p({
      label: "电子邮箱",
      required: true,
      asterisk: true
    })
  } : {}, {
    J: _ctx.formData.sendType === "1" || _ctx.formData.sendType === "2"
  }, _ctx.formData.sendType === "1" || _ctx.formData.sendType === "2" ? {
    K: common_vendor.o(($event) => _ctx.formData.address = $event),
    L: common_vendor.p({
      placeholder: "请输入邮寄地址",
      maxlength: 100,
      modelValue: _ctx.formData.address
    }),
    M: common_vendor.p({
      label: "邮寄地址"
    })
  } : {}, {
    N: common_vendor.o(($event) => _ctx.formData.phone = $event),
    O: common_vendor.p({
      placeholder: "请输入联系电话",
      type: "number",
      modelValue: _ctx.formData.phone
    }),
    P: common_vendor.p({
      label: "联系电话",
      required: true,
      asterisk: true
    }),
    Q: common_vendor.o(($event) => _ctx.formData.remark = $event),
    R: common_vendor.p({
      placeholder: "请输入备注信息（选填）",
      maxlength: 200,
      modelValue: _ctx.formData.remark
    }),
    S: common_vendor.p({
      label: "备注"
    }),
    T: common_vendor.o(_ctx.closeFormPopup),
    U: common_vendor.p({
      type: "default",
      background: "#E8E8E8",
      color: "#333333"
    }),
    V: common_vendor.t(_ctx.formMode === "edit" ? "保存" : "提交"),
    W: common_vendor.o(_ctx.submitForm),
    X: common_vendor.p({
      type: "primary",
      background: _ctx.primaryColor,
      loading: _ctx.isSubmitting
    }),
    Y: common_vendor.o(_ctx.closeFormPopup),
    Z: common_vendor.p({
      show: _ctx.showFormPopup,
      height: "75%"
    }),
    aa: common_vendor.o(_ctx.onPickerConfirm),
    ab: common_vendor.o(_ctx.closePicker),
    ac: common_vendor.p({
      show: _ctx.pickerConfig.show,
      options: _ctx.pickerConfig.options,
      zIndex: 1100
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/archiveQueryPage/archiveQueryPage.js.map

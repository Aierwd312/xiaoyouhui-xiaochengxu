"use strict";
const common_vendor = require("../../common/vendor.js");
const api_archives = require("../../api/archives.js");
const store_index = require("../../store/index.js");
const archiveQueryPageJs = {
  data() {
    return {
      // 导航栏配置
      navBackground: "#004299",
      navTitleColor: "#FFFFFF",
      primaryColor: "#004299",
      // 申请列表数据
      applications: [],
      // 表单数据
      formData: {
        title: "",
        // 申请标题
        applicationFile: "",
        // 申请材料
        applicationReason: "",
        // 申请原因
        applicationAnnexes: "",
        // 申请附件
        sendType: "",
        // 接收方式值
        sendTypeText: "",
        // 接收方式显示文本
        email: "",
        // 电子邮箱
        address: "",
        // 邮寄地址
        phone: "",
        // 联系电话
        remark: ""
        // 备注
      },
      // 接收方式选项（字符串数组）
      sendTypeOptions: ["电子档", "纸质档(邮寄)", "两者都需要"],
      // 接收方式映射
      sendTypeMap: {
        "电子档": "email",
        "纸质档(邮寄)": "paper",
        "两者都需要": "both"
      },
      // 选择器配置
      pickerConfig: {
        show: false,
        options: [],
        currentField: ""
      },
      // 状态控制
      isLoading: false,
      // 列表加载状态
      isSubmitting: false,
      // 提交加载状态
      showFormPopup: false,
      // 是否显示表单弹窗
      formMode: "add",
      // 表单模式：add-新增, edit-编辑
      currentEditId: null
      // 当前编辑的申请ID
    };
  },
  onLoad() {
    this.loadApplications();
  },
  onShow() {
    this.loadApplications();
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
     * 加载申请列表
     */
    async loadApplications() {
      try {
        this.isLoading = true;
        const userInfo2 = store_index.store.getters.userInfo || {};
        const userId = userInfo2.userId || userInfo2.id;
        common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:89", "=== 加载档案申请列表 ===");
        common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:90", "用户信息:", userInfo2);
        common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:91", "用户ID:", userId);
        const queryParams = {
          applicant: userId
          // 可以添加其他查询条件
          // status: '', // 申请状态筛选
          // title: '', // 标题筛选
          // applicationFile: '', // 申请材料筛选
        };
        common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:102", "查询参数:", queryParams);
        const response = await api_archives.getArchiveApplicationList(queryParams);
        common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:106", "API响应:", response);
        if (response && response.code === 1) {
          if (response.rows && Array.isArray(response.rows)) {
            this.applications = response.rows.map((item) => ({
              ...item,
              status: this.mapStatus(item.status),
              statusText: this.getStatusText(item.status)
            }));
            common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:116", "处理后的申请列表:", this.applications);
            common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:117", "总记录数:", response.total);
          } else {
            this.applications = [];
            common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:120", "无申请记录");
          }
        } else {
          this.applications = [];
          const errorMsg = (response == null ? void 0 : response.msg) || "获取列表失败";
          common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:126", "API响应错误:", errorMsg);
          common_vendor.index.showToast({
            title: errorMsg,
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:133", "加载申请列表失败:", error);
        this.applications = [];
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * 显示申请表单
     */
    showApplicationForm() {
      this.formMode = "add";
      this.currentEditId = null;
      this.resetFormData();
      const userInfo2 = store_index.store.getters.userInfo || {};
      this.formData.phone = userInfo2.phonenumber || userInfo2.phone || "";
      this.formData.email = userInfo2.email || "";
      this.showFormPopup = true;
    },
    /**
     * 关闭表单弹窗
     */
    closeFormPopup() {
      this.showFormPopup = false;
      this.resetFormData();
    },
    /**
     * 重置表单数据
     */
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
    /**
     * 打开接收方式选择器
     */
    showSendTypePicker() {
      this.pickerConfig = {
        show: true,
        options: this.sendTypeOptions,
        currentField: "sendType"
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
        const selectedText = e.text;
        const selectedValue = this.sendTypeMap[selectedText];
        this.closePicker();
        setTimeout(() => {
          this.formData.sendTypeText = selectedText;
          this.formData.sendType = selectedValue;
        }, 150);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:219", "选择器确认错误:", error);
        this.closePicker();
      }
    },
    /**
     * 下载查询结果
     */
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
          common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:262", "下载失败:", error);
          common_vendor.index.showToast({
            title: "下载失败",
            icon: "none"
          });
        }
      });
    },
    /**
     * 提交表单
     */
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }
      try {
        this.isSubmitting = true;
        const submitData = {
          title: this.formData.title,
          // applicant: userId,
          // applicantUserName: userName,
          // applicantNickName: userInfo.nickName || '',
          // deptId: userInfo.deptId || 1, // 默认为1
          applicationFile: this.formData.applicationFile,
          applicationReason: this.formData.applicationReason,
          applicationAnnexes: this.formData.applicationAnnexes || "",
          // 申请附件
          sendType: this.formData.sendType,
          email: this.formData.email || userInfo.email || "",
          address: this.formData.address || "",
          phone: this.formData.phone,
          // status: '0', // 0-待审核
          reviewer: null,
          // 审核人，新增时为空
          reviewerName: "",
          // 审核人姓名
          reviewComments: "",
          // 审核意见
          // createBy: userName, // 创建者
          // updateBy: userName, // 更新者
          remark: this.formData.remark || "",
          params: {
            // 扩展参数，可用于存储额外信息
          }
        };
        if (this.formMode === "edit" && this.currentEditId) {
          submitData.id = this.currentEditId;
          common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:338", "调用编辑API:", submitData);
          const response = await api_archives.updateArchiveApplication(submitData);
          common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:340", "编辑API响应:", response);
          common_vendor.index.showToast({
            title: "修改成功",
            icon: "success"
          });
        } else {
          common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:346", "调用新增API:", submitData);
          const response = await api_archives.addArchiveApplication(submitData);
          common_vendor.index.__f__("log", "at pages/archiveQueryPage/archiveQueryPage.js:348", "新增API响应:", response);
          common_vendor.index.showToast({
            title: "提交成功",
            icon: "success"
          });
        }
        this.loadApplications();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:356", "提交错误:", error);
        common_vendor.index.showToast({
          title: this.formMode === "edit" ? "修改失败" : "提交失败",
          icon: "none"
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    /**
     * 表单验证
     */
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
      if ((this.formData.sendType === "email" || this.formData.sendType === "both") && !this.formData.email) {
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
      if ((this.formData.sendType === "paper" || this.formData.sendType === "both") && !this.formData.address) {
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
    /**
     * 编辑档案申请
     */
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
    /**
     * 撤回档案申请
     */
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
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:501", "撤回失败:", error);
        common_vendor.index.showToast({
          title: "撤回失败",
          icon: "none"
        });
      }
    },
    /**
     * 删除档案申请
     */
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
        common_vendor.index.__f__("error", "at pages/archiveQueryPage/archiveQueryPage.js:534", "删除申请错误:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "删除失败，请重试",
          icon: "none"
        });
      }
    },
    /**
     * 映射状态值
     */
    mapStatus(statusValue) {
      const statusMap = {
        "0": "pending",
        "1": "completed",
        "2": "rejected"
      };
      return statusMap[String(statusValue)] || "pending";
    },
    /**
     * 获取状态文本
     */
    getStatusText(statusValue) {
      const textMap = {
        "0": "待审核",
        "1": "已通过",
        "2": "已拒绝"
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
      isOccupy: true
    }),
    e: common_vendor.p({
      name: "add",
      color: "#FFFFFF",
      size: 32
    }),
    f: common_vendor.o(_ctx.showApplicationForm),
    g: common_vendor.p({
      type: "primary",
      background: _ctx.primaryColor
    }),
    h: common_vendor.t(_ctx.applications.length),
    i: _ctx.isLoading
  }, _ctx.isLoading ? {
    j: common_vendor.p({
      text: "加载中...",
      iconColor: "#004299"
    })
  } : _ctx.applications.length === 0 ? {
    l: common_vendor.p({
      name: "file-search-line",
      size: 80,
      color: "#CCCCCC"
    })
  } : {
    m: common_vendor.f(_ctx.applications, (app, index, i0) => {
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
        i: app.reviewComments
      }, app.reviewComments ? {
        j: common_vendor.t(app.reviewComments)
      } : {}, {
        k: app.status === "pending"
      }, app.status === "pending" ? {
        l: common_vendor.o(($event) => _ctx.editApplication(app), app.id),
        m: "c9b8c156-6-" + i0,
        n: common_vendor.p({
          size: "small",
          background: "#FF9800"
        }),
        o: common_vendor.o(($event) => _ctx.withdrawApplication(app.id), app.id),
        p: "c9b8c156-7-" + i0,
        q: common_vendor.p({
          size: "small",
          background: "#2A6DCF"
        }),
        r: common_vendor.o(($event) => _ctx.deleteApplication(app.id), app.id),
        s: "c9b8c156-8-" + i0,
        t: common_vendor.p({
          size: "small",
          background: "#FF5151"
        })
      } : {}, {
        v: app.status === "completed"
      }, app.status === "completed" ? {
        w: common_vendor.o(($event) => _ctx.downloadResult(app.id), app.id),
        x: "c9b8c156-9-" + i0,
        y: common_vendor.p({
          size: "small",
          background: _ctx.primaryColor
        })
      } : {}, {
        z: app.status === "rejected"
      }, app.status === "rejected" ? {
        A: common_vendor.o(($event) => _ctx.deleteApplication(app.id), app.id),
        B: "c9b8c156-10-" + i0,
        C: common_vendor.p({
          size: "small",
          background: "#FF5151"
        })
      } : {}, {
        D: app.id
      });
    })
  }, {
    k: _ctx.applications.length === 0,
    n: $setup.navHeight + "px",
    o: common_vendor.t(_ctx.formMode === "edit" ? "编辑" : "新增"),
    p: common_vendor.o(($event) => _ctx.formData.title = $event),
    q: common_vendor.p({
      placeholder: "请输入申请标题",
      modelValue: _ctx.formData.title
    }),
    r: common_vendor.p({
      label: "申请标题",
      required: true,
      asterisk: true
    }),
    s: common_vendor.o(($event) => _ctx.formData.applicationFile = $event),
    t: common_vendor.p({
      placeholder: "请输入申请材料名称（如：成绩单）",
      modelValue: _ctx.formData.applicationFile
    }),
    v: common_vendor.p({
      label: "申请材料",
      required: true,
      asterisk: true
    }),
    w: common_vendor.o(($event) => _ctx.formData.applicationReason = $event),
    x: common_vendor.p({
      placeholder: "请输入申请原因",
      maxlength: 200,
      modelValue: _ctx.formData.applicationReason
    }),
    y: common_vendor.p({
      label: "申请原因",
      required: true,
      asterisk: true
    }),
    z: common_vendor.o(_ctx.showSendTypePicker),
    A: common_vendor.o(($event) => _ctx.formData.sendTypeText = $event),
    B: common_vendor.p({
      placeholder: "请选择接收方式",
      readonly: true,
      rightIcon: "right",
      modelValue: _ctx.formData.sendTypeText
    }),
    C: common_vendor.p({
      label: "接收方式",
      required: true,
      asterisk: true
    }),
    D: _ctx.formData.sendType === "email" || _ctx.formData.sendType === "both"
  }, _ctx.formData.sendType === "email" || _ctx.formData.sendType === "both" ? {
    E: common_vendor.o(($event) => _ctx.formData.email = $event),
    F: common_vendor.p({
      placeholder: "请输入电子邮箱",
      type: "email",
      modelValue: _ctx.formData.email
    }),
    G: common_vendor.p({
      label: "电子邮箱",
      required: true,
      asterisk: true
    })
  } : {}, {
    H: _ctx.formData.sendType === "paper" || _ctx.formData.sendType === "both"
  }, _ctx.formData.sendType === "paper" || _ctx.formData.sendType === "both" ? {
    I: common_vendor.o(($event) => _ctx.formData.address = $event),
    J: common_vendor.p({
      placeholder: "请输入邮寄地址",
      maxlength: 100,
      modelValue: _ctx.formData.address
    }),
    K: common_vendor.p({
      label: "邮寄地址"
    })
  } : {}, {
    L: common_vendor.o(($event) => _ctx.formData.phone = $event),
    M: common_vendor.p({
      placeholder: "请输入联系电话",
      type: "number",
      modelValue: _ctx.formData.phone
    }),
    N: common_vendor.p({
      label: "联系电话",
      required: true,
      asterisk: true
    }),
    O: common_vendor.o(($event) => _ctx.formData.remark = $event),
    P: common_vendor.p({
      placeholder: "请输入备注信息（选填）",
      maxlength: 200,
      modelValue: _ctx.formData.remark
    }),
    Q: common_vendor.p({
      label: "备注"
    }),
    R: common_vendor.o(_ctx.closeFormPopup),
    S: common_vendor.p({
      type: "default",
      background: "#E8E8E8",
      color: "#333333"
    }),
    T: common_vendor.t(_ctx.formMode === "edit" ? "保存" : "提交"),
    U: common_vendor.o(_ctx.submitForm),
    V: common_vendor.p({
      type: "primary",
      background: _ctx.primaryColor,
      loading: _ctx.isSubmitting
    }),
    W: common_vendor.o(_ctx.closeFormPopup),
    X: common_vendor.p({
      show: _ctx.showFormPopup,
      height: "75%"
    }),
    Y: common_vendor.o(_ctx.onPickerConfirm),
    Z: common_vendor.o(_ctx.closePicker),
    aa: common_vendor.p({
      show: _ctx.pickerConfig.show,
      options: _ctx.pickerConfig.options,
      zIndex: 1100
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/archiveQueryPage/archiveQueryPage.js.map

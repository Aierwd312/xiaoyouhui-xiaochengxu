"use strict";
const components_firstui_fuiForm_fuiValidator = require("./fui-validator.js");
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-form",
  props: {
    model: {
      type: Object,
      default() {
        return {};
      }
    },
    //表单padding值（上，右，下，左），同css顺序
    padding: {
      type: Array,
      default() {
        return [];
      }
    },
    //是否显示校验错误信息，设置false时，则触发formItem校验
    show: {
      type: Boolean,
      default: true
    },
    //是否禁用该表单内的所有组件,透明遮罩层
    disabled: {
      type: Boolean,
      default: false
    },
    //提示框top值 px
    top: {
      type: [Number, String],
      default: 0
    },
    left: {
      type: [Number, String],
      default: 24
    },
    right: {
      type: [Number, String],
      default: 24
    },
    //错误提示框背景色
    background: {
      type: String,
      default: ""
    },
    //错误提示字体大小
    size: {
      type: [Number, String],
      default: 28
    },
    //错误提示字体颜色
    color: {
      type: String,
      default: "#fff"
    },
    //错误提示框圆角值
    radius: {
      type: [Number, String],
      default: 16
    },
    //错误消息显示时间 ms
    duration: {
      type: Number,
      default: 2e3
    },
    //form-item标题字体大小 默认使用全局设置值
    labelSize: {
      type: [Number, String],
      default: 0
    },
    labelColor: {
      type: String,
      default: ""
    },
    //form-item label宽度,单位rpx 默认使用全局设置值
    labelWidth: {
      type: [Number, String],
      default: 0
    },
    //label 对齐方式：left，right
    labelAlign: {
      type: String,
      default: ""
    },
    labelWeight: {
      type: [Number, String],
      default: 0
    },
    // form-item 必填项星号颜色
    asteriskColor: {
      type: String,
      default: ""
    },
    //left,right
    asteriskPosition: {
      type: String,
      default: ""
    },
    //v2.1.0+ 1-absolute 2-relative
    errorPosition: {
      type: [Number, String],
      default: 1
    },
    //v2.1.0+ left/center/right
    errorAlign: {
      type: String,
      default: "center"
    }
  },
  provide() {
    return {
      form: this
    };
  },
  computed: {
    getBgColor() {
      let color = this.background;
      return color;
    }
  },
  watch: {
    /* // 备用方案，暂时未启用
    model: {
    	handler: function(vals, oldVal) {
    		if (this.children && vals && !this.show) {
    			this.children.forEach(item => {
    				if (item.prop && item.prop !== true) {
    					item.setValue(vals[item] || '')
    				}
    			})
    		}
    	},
    	deep: true
    },
    */
    show(val) {
      if (this.children && this.children.length > 0) {
        this.children.forEach((item) => {
          item.showError = val ? false : true;
        });
      }
    }
  },
  data() {
    return {
      errorMsg: "",
      timer: null,
      rules: [],
      mergeRules: [],
      isRealTime: false
    };
  },
  created() {
    this.children = [];
  },
  beforeUnmount() {
    this.clearTimer();
  },
  methods: {
    clearTimer() {
      this.children = null;
      clearTimeout(this.timer);
      this.timer = null;
    },
    getFormItemRules() {
      let rules = [];
      if (this.children && this.children.length > 0) {
        this.children.forEach((child) => {
          let rule = child.getRules();
          rule && rules.push(rule);
        });
      }
      return rules;
    },
    getMergeRules(rules) {
      if (this.mergeRules.length === 0)
        return rules;
      let formRules = [...rules];
      this.mergeRules.forEach((item) => {
        const index = rules.findIndex((e) => e.name === item.name);
        if (index === -1) {
          formRules.push(item);
        } else {
          formRules[index] = item;
        }
      });
      return formRules;
    },
    /**
     * 校验方法
     * @param {Object} model 表单数据对象
     * @param {Array} rules 表单验证规则
     * @param {Boolean} checkAll 校验所有元素，结合FormItem组件显示校验提示时必须传true
     */
    validator(model, rules, checkAll = false) {
      model = model || this.model;
      rules = rules || [];
      return new Promise((resolve, reject) => {
        try {
          if (rules.length === 0) {
            rules = this.getFormItemRules();
          } else {
            rules = this.getMergeRules(rules);
          }
          let res = components_firstui_fuiForm_fuiValidator.form.validator(model, rules, checkAll);
          if (!res.isPassed) {
            let errors = res.errorMsg;
            if (this.show) {
              this.clearTimer();
              if (checkAll) {
                errors = errors[0].msg;
              }
              this.errorMsg = errors;
              this.timer = setTimeout(() => {
                this.errorMsg = "";
              }, this.duration);
            } else {
              if (checkAll && this.children && this.children.length > 0) {
                this.children.forEach((item) => {
                  const index = errors.findIndex((err) => err.name === item.prop);
                  if (item.prop && item.prop !== true && ~index) {
                    item.errorMsg = errors[index].msg;
                    item.itemValue = this.model[item.prop];
                  }
                });
              }
            }
          }
          resolve(res);
        } catch (e) {
          reject({
            isPassed: false,
            errorMsg: "校验出错，请检查传入的数据格式是否有误！"
          });
        }
      });
    },
    /**
     * 验证具体的某个字段
     * @param {Array<string> ｜ String} props 字段key
     * @param {Object} model 表单数据对象，传null则使用属性中model值
     * @param {Array} rules 表单验证规则，当传null 或空数组时使用FormItem组件内rules
     */
    validateField(props, model, rules) {
      if (!rules || rules.length === 0) {
        rules = this.getFormItemRules();
      } else {
        rules = this.getMergeRules(rules);
      }
      const isString = typeof props === "string";
      const formRules = rules.filter((item) => props === item.name || !isString && props.indexOf(item.name) !== -1);
      model = model || this.model;
      return this.validator(model, formRules, true);
    },
    //v2.1.0+ 通知formItem组件重置props参数
    resetFormItemParam() {
      if (this.children && this.children.length > 0) {
        this.children.forEach((item) => {
          item.initParam(true);
        });
      }
    },
    //v2.1.0+ 通知formItem组件开启实时校验
    switchRealTimeValidator(isOpen, rules = []) {
      this.isRealTime = isOpen;
      if (isOpen) {
        if (!rules || rules.length === 0) {
          rules = this.getFormItemRules();
        } else {
          rules = this.getMergeRules(rules);
        }
        this.rules = rules || [];
      }
      if (this.children && this.children.length > 0) {
        this.children.forEach((item) => {
          item.switchRealTimeValidator(isOpen);
        });
      }
    },
    //内部方法，提供给FormItem组件使用
    realTimeValidator(prop, model, rules) {
      return new Promise((resolve, reject) => {
        try {
          let res = components_firstui_fuiForm_fuiValidator.form.validator(model || this.model, rules || this.rules, true);
          if (!res.isPassed) {
            let errors = res.errorMsg;
            const index = errors.findIndex((err) => err.name === prop);
            if (~index) {
              res.errorMsg = errors[index].msg;
            } else {
              res.isPassed = true;
              res.errorMsg = "";
            }
          }
          resolve(res);
        } catch (e) {
          reject({
            isPassed: false,
            errorMsg: "校验出错，请检查传入的数据格式是否有误！"
          });
        }
      });
    },
    clearValidate(props = []) {
      let arr = props;
      arr = !arr ? [] : arr;
      if (typeof props === "string") {
        arr = [props];
      }
      if (this.children && this.children.length > 0) {
        if (arr && arr.length > 0) {
          this.children.forEach((item) => {
            if (item.prop && ~arr.indexOf(item.prop)) {
              item.errorMsg = "";
            }
          });
        } else {
          this.children.forEach((item) => {
            item.errorMsg = "";
          });
        }
      }
    },
    // 移除表单项
    uninstall(instance) {
      if (this.children && this.children.length > 0) {
        const index = this.children.findIndex((item) => item === instance);
        if (index !== -1) {
          this.children.splice(index, 1);
        }
        const rules = instance.getRules() || {};
        const prop = instance.prop || rules.name || "";
        const idx = this.mergeRules.findIndex((ru) => ru.name === prop);
        if (idx !== -1) {
          this.mergeRules.splice(idx, 1);
        }
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.show
  }, $props.show ? {
    b: common_vendor.t($data.errorMsg),
    c: $props.size + "rpx",
    d: $props.color,
    e: $props.top + "px",
    f: $props.left + "rpx",
    g: $props.right + "rpx",
    h: $options.getBgColor,
    i: $props.radius + "rpx",
    j: !$options.getBgColor ? 1 : "",
    k: $data.errorMsg ? 1 : ""
  } : {}, {
    l: $props.disabled
  }, $props.disabled ? {} : {}, {
    m: $props.padding[0] || 0,
    n: $props.padding[1] || 0,
    o: $props.padding[2] || $props.padding[0] || 0,
    p: $props.padding[3] || $props.padding[1] || 0
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5f917458"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/components/firstui/fui-form/fui-form.js.map

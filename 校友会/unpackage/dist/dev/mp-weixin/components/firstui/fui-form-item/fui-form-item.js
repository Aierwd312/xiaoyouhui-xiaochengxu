"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "fui-form-item",
  emits: ["click"],
  inject: {
    form: {
      value: "form",
      default: null
    }
  },
  props: {
    //padding值，上、右、下、左
    padding: {
      type: Array,
      default() {
        return ["30rpx", "32rpx"];
      }
    },
    //margin-top 单位rpx
    marginTop: {
      type: [Number, String],
      default: 0
    },
    //margin-bottom 单位rpx
    marginBottom: {
      type: [Number, String],
      default: 0
    },
    //标签文本
    label: {
      type: String,
      default: ""
    },
    //标题字体大小 默认使用全局设置值
    labelSize: {
      type: [Number, String],
      default: 0
    },
    labelColor: {
      type: String,
      default: ""
    },
    //label宽度 rpx 默认使用全局设置值
    labelWidth: {
      type: [Number, String],
      default: 0
    },
    //默认使用全局设置值
    labelRight: {
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
    //是否显示必填的红色星号
    asterisk: {
      type: Boolean,
      default: false
    },
    asteriskColor: {
      type: String,
      default: ""
    },
    //left,right
    asteriskPosition: {
      type: String,
      default: ""
    },
    background: {
      type: String,
      default: "#fff"
    },
    highlight: {
      type: Boolean,
      default: false
    },
    arrow: {
      type: Boolean,
      default: false
    },
    arrowColor: {
      type: String,
      default: "#B2B2B2"
    },
    bottomBorder: {
      type: Boolean,
      default: true
    },
    borderColor: {
      type: String,
      default: "#EEEEEE"
    },
    //下边框left值，单位rpx
    left: {
      type: [Number, String],
      default: 32
    },
    //下边框right值，单位rpx
    right: {
      type: [Number, String],
      default: 0
    },
    radius: {
      type: String,
      default: "0"
    },
    param: {
      type: [Number, String],
      default: 0
    },
    //v2.1.0+ 表单域 model 字段，在使用校验时该属性是必填的
    prop: {
      type: String,
      default: ""
    },
    //v2.1.0+ 1-absolute 2-relative
    errorPosition: {
      type: [Number, String],
      default: 0
    },
    //v2.1.0+ left/center/right
    errorAlign: {
      type: String,
      default: ""
    },
    //V2.2.0 表单验证规则，部分平台不支持嵌套传入函数，请使用setRules方法传入
    rules: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    //优先级：form-item组件props > form组件props > 全局属性值
    getLabelSize() {
      const labelSize = common_vendor.index.$fui && common_vendor.index.$fui.fuiFormItem && common_vendor.index.$fui.fuiFormItem.labelSize || 32;
      return `${this.labelSize || this.lSize || labelSize}rpx`;
    },
    getLabelWidth() {
      const labelWidth = common_vendor.index.$fui && common_vendor.index.$fui.fuiFormItem && common_vendor.index.$fui.fuiFormItem.labelWidth || 160;
      return `${this.labelWidth || this.lWidth || labelWidth}rpx`;
    },
    getLabelRight() {
      const labelRight = common_vendor.index.$fui && common_vendor.index.$fui.fuiFormItem && common_vendor.index.$fui.fuiFormItem.labelRight || 30;
      return `${this.labelRight || labelRight}rpx`;
    },
    getLabelAlign() {
      const labelAlign = common_vendor.index.$fui && common_vendor.index.$fui.fuiFormItem && common_vendor.index.$fui.fuiFormItem.labelAlign || "left";
      return this.labelAlign || this.lAlign || labelAlign;
    },
    getLabelWeight() {
      const global = common_vendor.index.$fui && common_vendor.index.$fui.fuiFormItem && common_vendor.index.$fui.fuiFormItem.labelWeight || 400;
      return this.labelWeight || this.lWeight || global;
    },
    getAkPosi() {
      const akPosi = common_vendor.index.$fui && common_vendor.index.$fui.fuiFormItem && common_vendor.index.$fui.fuiFormItem.asteriskPosition || "left";
      const position = this.asteriskPosition || this.akPosi || akPosi;
      const lWidth = this.getLabelWidth.replace("rpx", "");
      const lRight = this.getLabelRight.replace("rpx", "");
      const pr = this.padding[1];
      const pdr = pr ? pr.replace("rpx", "").replace("px", "") : 0;
      return position === "right" ? `${Number(lWidth) + Number(pdr || 0) - Number(lRight || 0)}rpx` : "12rpx";
    },
    dangerColor() {
      const app = common_vendor.index && common_vendor.index.$fui && common_vendor.index.$fui.color;
      return app && app.danger || "#FF2B2B";
    },
    getErrorLeft() {
      const align = this.getErrorAlign;
      let left = "32rpx";
      if (align === "center") {
        const lWidth = this.getLabelWidth.replace("rpx", "").replace("px", "");
        const pr = this.padding[1];
        const pdr = pr ? pr.replace("rpx", "").replace("px", "") : 0;
        left = Number(lWidth) + Number(pdr) + "rpx";
      }
      return left;
    },
    getErrorPosition() {
      return this.errorPosition || this.ePosition;
    },
    getErrorAlign() {
      return this.errorAlign || this.eAlign;
    }
  },
  data() {
    return {
      lSize: 0,
      lColor: "",
      lWidth: 0,
      lAlign: "",
      lWeight: 0,
      akColor: "",
      akPosi: "",
      ePosition: 1,
      eAlign: "left",
      errorMsg: "",
      //此参数由fui-form中获取
      showError: false,
      //由父组件赋值
      itemValue: "",
      watchKey: "",
      //是否实时校验
      isRealTime: false,
      //item项自己的rules
      formItemRules: null
    };
  },
  watch: {
    prop: {
      handler(val) {
        setTimeout(() => {
          const key = `form.model.${val || "fui_unknown"}`;
          if (val && val !== true && this.form && key != this.watchKey) {
            this.watchKey = key;
            this.$watch(key, (val2) => {
              if (this.isRealTime && this.prop && this.form) {
                this.form.realTimeValidator(this.prop).then((res) => {
                  if (res.isPassed) {
                    this.errorMsg = "";
                  } else {
                    this.errorMsg = res.errorMsg;
                  }
                }).catch((err) => {
                  common_vendor.index.__f__("log", "at components/firstui/fui-form-item/fui-form-item.vue:282", err.errorMsg);
                });
              } else {
                if (this.showError && val2 != this.itemValue) {
                  this.errorMsg = "";
                }
              }
            });
          }
        }, 50);
      },
      immediate: true
    }
  },
  created() {
    this.initParam();
  },
  beforeUnmount() {
    this.uninstall();
  },
  methods: {
    //备用方案，如果watch无法使用则使用赋值方式
    setValue(val) {
      if (this.showError && val != this.itemValue) {
        this.errorMsg = "";
      }
    },
    initParam(isReset) {
      if (this.form) {
        !isReset && this.form.children.push(this);
        this.isRealTime = this.form.isRealTime;
        this.showError = this.form.show ? false : true;
        this.lSize = this.form.labelSize;
        this.lColor = this.form.labelColor;
        this.lWidth = this.form.labelWidth;
        this.lWeight = this.form.labelWeight;
        this.lAlign = this.form.labelAlign;
        this.akColor = this.form.asteriskColor;
        this.akPosi = this.form.asteriskPosition;
        this.ePosition = this.form.errorPosition;
        this.eAlign = this.form.errorAlign;
      }
    },
    //是否开启实时校验
    switchRealTimeValidator(isOpen) {
      this.isRealTime = isOpen;
    },
    // Form组件获取当前FormItem 项 rules数据
    getRules() {
      const rules = this.formItemRules || this.rules;
      if (!rules.name && (rules.rule || rules.validator)) {
        rules["name"] = this.prop;
      }
      return !rules.name ? null : rules;
    },
    //设置校验规则
    setRules(rules) {
      this.formItemRules = rules;
    },
    //设置校验规则，并合并或替换Form组件中该prop对应的rules【当页面调用Form组件校验方法传入rules时进行合并操作】
    setRulesMerge(rules) {
      this.formItemRules = rules || this.rules;
      if (this.form) {
        const index = this.form.mergeRules.findIndex((e) => e.name === rules.name || e.name === this.prop);
        const rule = this.getRules();
        if (!rule)
          return;
        if (index === -1) {
          this.form.mergeRules.push(rule);
        } else {
          this.form.mergeRules[index] = rule;
        }
      }
    },
    /**
     * 验证方法
     * @param {any} value 值，不传则使用Form组件model中值
     */
    validator(value) {
      const rules = this.getRules();
      return new Promise((resolve, reject) => {
        if (this.form && rules) {
          const model = {};
          let val = value;
          if (val === void 0 || val === null) {
            val = this.form.model[rules.name] || null;
          }
          model[rules.name] = val;
          this.form.realTimeValidator(rules.name, model, [rules]).then((res) => {
            if (res.isPassed) {
              this.errorMsg = "";
            } else {
              this.errorMsg = res.errorMsg;
            }
            resolve(res);
          }).catch((err) => {
            reject(err);
            common_vendor.index.__f__("log", "at components/firstui/fui-form-item/fui-form-item.vue:389", err.errorMsg);
          });
        } else {
          reject({
            isPassed: false,
            errorMsg: "未检查到Form组件或校验规则rules数据！"
          });
        }
      });
    },
    clearValidate() {
      this.errorMsg = "";
    },
    uninstall() {
      this.form && this.form.uninstall(this);
    },
    handleClick() {
      this.$emit("click", {
        param: this.param
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.asterisk
  }, $props.asterisk ? {
    b: $props.asteriskColor || $data.akColor || $options.dangerColor,
    c: $options.getAkPosi
  } : {}, {
    d: $props.label
  }, $props.label ? {
    e: common_vendor.t($props.label),
    f: $options.getLabelWidth,
    g: $options.getLabelSize,
    h: $props.labelColor || $data.lColor || "#333",
    i: $options.getLabelRight,
    j: $options.getLabelAlign,
    k: $options.getLabelWeight
  } : {}, {
    l: $props.arrow
  }, $props.arrow ? {
    m: $props.arrowColor
  } : {}, {
    n: $props.padding[1] || 0,
    o: $props.padding[3] || $props.padding[1] || 0,
    p: $props.bottomBorder
  }, $props.bottomBorder ? {
    q: $props.borderColor,
    r: $props.left + "rpx",
    s: $props.right + "rpx"
  } : {}, {
    t: $props.highlight ? 1 : "",
    v: $props.padding[0] || 0,
    w: $props.padding[2] || $props.padding[0] || 0,
    x: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args)),
    y: $options.getErrorPosition == 1 && $data.showError && $props.prop
  }, $options.getErrorPosition == 1 && $data.showError && $props.prop ? {
    z: common_vendor.t($data.errorMsg),
    A: $options.getErrorAlign == "right" ? 1 : "",
    B: $props.asteriskColor || $data.akColor || $options.dangerColor,
    C: $options.getErrorPosition == 1 ? 1 : "",
    D: $options.getErrorAlign == "right" ? 1 : "",
    E: $data.errorMsg && $data.errorMsg !== true ? 1 : "",
    F: $options.getErrorLeft,
    G: $props.padding[1] || "32rpx"
  } : {}, {
    H: $options.getErrorPosition == 2 && $data.errorMsg && $data.errorMsg !== true && $data.showError && $props.prop
  }, $options.getErrorPosition == 2 && $data.errorMsg && $data.errorMsg !== true && $data.showError && $props.prop ? {
    I: common_vendor.t($data.errorMsg),
    J: $options.getErrorAlign == "right" ? 1 : "",
    K: $props.asteriskColor || $data.akColor || $options.dangerColor,
    L: $options.getErrorPosition == 2 ? 1 : "",
    M: $options.getErrorAlign == "right" ? 1 : "",
    N: $options.getErrorLeft,
    O: $props.padding[1] || "32rpx"
  } : {}, {
    P: $props.background,
    Q: $props.marginTop + "rpx",
    R: $props.marginBottom + "rpx",
    S: $props.radius
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a27156ed"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/components/firstui/fui-form-item/fui-form-item.js.map

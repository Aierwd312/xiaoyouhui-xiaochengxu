"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      params: {},
      webviewStyles: {
        progress: {
          color: "#FF3333"
        }
      }
    };
  },
  props: {
    src: {
      type: [String],
      default: null
    }
  },
  onLoad(event) {
    this.params = event;
    if (event.title) {
      common_vendor.index.setNavigationBarTitle({
        title: event.title
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.params.url
  }, $data.params.url ? {
    b: $data.webviewStyles,
    c: `${$data.params.url}`
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/common/webview/index.js.map

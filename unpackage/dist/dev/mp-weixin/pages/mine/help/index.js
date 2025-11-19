"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const list = common_vendor.ref([
      {
        icon: "iconfont icon-github",
        title: "若依问题",
        childList: [{
          title: "若依开源吗？",
          content: "开源"
        }, {
          title: "若依可以商用吗？",
          content: "可以"
        }, {
          title: "若依官网地址多少？",
          content: "http://ruoyi.vip"
        }, {
          title: "若依文档地址多少？",
          content: "http://doc.ruoyi.vip"
        }]
      },
      {
        icon: "iconfont icon-help",
        title: "其他问题",
        childList: [{
          title: "如何退出登录？",
          content: "请点击[我的] - [应用设置] - [退出登录]即可退出登录"
        }, {
          title: "如何修改用户头像？",
          content: "请点击[我的] - [选择头像] - [点击提交]即可更换用户头像"
        }, {
          title: "如何修改登录密码？",
          content: "请点击[我的] - [应用设置] - [修改密码]即可修改登录密码"
        }]
      }
    ]);
    function handleText(item) {
      common_vendor.index.navigateTo({
        url: `/pages/common/textview/index?title=${item.title}&content=${item.content}`
      });
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(list.value, (item, findex, i0) => {
          return {
            a: common_vendor.n(item.icon),
            b: common_vendor.t(item.title),
            c: common_vendor.f(item.childList, (child, zindex, i1) => {
              return common_vendor.e({
                a: common_vendor.t(child.title),
                b: zindex !== item.childList.length - 1
              }, zindex !== item.childList.length - 1 ? {} : {}, {
                c: zindex,
                d: common_vendor.o(($event) => handleText(child), zindex)
              });
            }),
            d: findex,
            e: item.title
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-abe738a3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/mine/help/index.js.map

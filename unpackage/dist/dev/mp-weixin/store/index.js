"use strict";
const store_modules_user = require("./modules/user.js");
const store_getters = require("./getters.js");
const common_vendor = require("../common/vendor.js");
const store = common_vendor.createStore({
  modules: {
    user: store_modules_user.user
  },
  getters: store_getters.getters
});
exports.store = store;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map

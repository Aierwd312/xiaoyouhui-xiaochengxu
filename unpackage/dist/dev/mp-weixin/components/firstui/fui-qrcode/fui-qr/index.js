"use strict";
const components_firstui_fuiQrcode_fuiQr_lib_QRCode = require("./lib/QRCode.js");
const components_firstui_fuiQrcode_fuiQr_lib_ErrorCorrectLevel = require("./lib/ErrorCorrectLevel.js");
var qrcode = function(data, opt) {
  opt = opt || {};
  var qr = new components_firstui_fuiQrcode_fuiQr_lib_QRCode.QRCode(
    opt.typeNumber || -1,
    opt.errorCorrectLevel || components_firstui_fuiQrcode_fuiQr_lib_ErrorCorrectLevel.ErrorCorrectLevel.H
  );
  qr.addData(data);
  qr.make();
  return qr;
};
qrcode.ErrorCorrectLevel = components_firstui_fuiQrcode_fuiQr_lib_ErrorCorrectLevel.ErrorCorrectLevel;
exports.qrcode = qrcode;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/components/firstui/fui-qrcode/fui-qr/index.js.map

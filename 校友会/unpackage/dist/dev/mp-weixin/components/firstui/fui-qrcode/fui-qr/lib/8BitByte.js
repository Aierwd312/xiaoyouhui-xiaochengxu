"use strict";
const components_firstui_fuiQrcode_fuiQr_lib_mode = require("./mode.js");
function QR8bitByte(data) {
  this.mode = components_firstui_fuiQrcode_fuiQr_lib_mode.Mode.MODE_8BIT_BYTE;
  this.data = data;
}
QR8bitByte.prototype = {
  getLength: function(buffer) {
    return this.data.length;
  },
  write: function(buffer) {
    for (var i = 0; i < this.data.length; i++) {
      buffer.put(this.data.charCodeAt(i), 8);
    }
  }
};
exports.QR8bitByte = QR8bitByte;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/components/firstui/fui-qrcode/fui-qr/lib/8BitByte.js.map

"use strict";
const components_firstui_fuiQrcode_fuiQr_lib_math = require("./math.js");
function QRPolynomial(num, shift) {
  if (num.length == void 0) {
    throw new Error(num.length + "/" + shift);
  }
  var offset = 0;
  while (offset < num.length && num[offset] == 0) {
    offset++;
  }
  this.num = new Array(num.length - offset + shift);
  for (var i = 0; i < num.length - offset; i++) {
    this.num[i] = num[i + offset];
  }
}
QRPolynomial.prototype = {
  get: function(index) {
    return this.num[index];
  },
  getLength: function() {
    return this.num.length;
  },
  multiply: function(e) {
    var num = new Array(this.getLength() + e.getLength() - 1);
    for (var i = 0; i < this.getLength(); i++) {
      for (var j = 0; j < e.getLength(); j++) {
        num[i + j] ^= components_firstui_fuiQrcode_fuiQr_lib_math.QRMath.gexp(components_firstui_fuiQrcode_fuiQr_lib_math.QRMath.glog(this.get(i)) + components_firstui_fuiQrcode_fuiQr_lib_math.QRMath.glog(e.get(j)));
      }
    }
    return new QRPolynomial(num, 0);
  },
  mod: function(e) {
    if (this.getLength() - e.getLength() < 0) {
      return this;
    }
    var ratio = components_firstui_fuiQrcode_fuiQr_lib_math.QRMath.glog(this.get(0)) - components_firstui_fuiQrcode_fuiQr_lib_math.QRMath.glog(e.get(0));
    var num = new Array(this.getLength());
    for (var i = 0; i < this.getLength(); i++) {
      num[i] = this.get(i);
    }
    for (var i = 0; i < e.getLength(); i++) {
      num[i] ^= components_firstui_fuiQrcode_fuiQr_lib_math.QRMath.gexp(components_firstui_fuiQrcode_fuiQr_lib_math.QRMath.glog(e.get(i)) + ratio);
    }
    return new QRPolynomial(num, 0).mod(e);
  }
};
exports.QRPolynomial = QRPolynomial;
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/components/firstui/fui-qrcode/fui-qr/lib/Polynomial.js.map

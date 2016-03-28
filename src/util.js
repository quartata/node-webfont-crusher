"use strict";

var path = require("path");

function util() {};

util.toArrayBuffer = function(buffer) {
  var view = new DataView(new ArrayBuffer(buffer.length), 0, buffer.length);
  for (var i = 0, l = buffer.length; i < l; i++) {
    view.setUint8(i, buffer[i], false);
  }
  return view.buffer;
};

util.toNodeBuffer = function(arrayBuffer) {
  var view = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
  var buffer = new Buffer(arrayBuffer.byteLength);
  for (var i = 0, l = arrayBuffer.byteLength; i < l; i++) {
    buffer[i] = view.getUint8(i, false);
  }
  return buffer;
};

util.resolveHome = function(_path) {
  if (_path[0] === "~") {
    return path.join(process.env.HOME, _path.slice(1));
  } else return _path
    .replace(/^("|')?\$(\{)?HOME(\})?("|')?/g, process.env.HOME);
};

module.exports = util;

"use strict";

function woff2() {
  // this.encode = require("bindings")("woff2_encode.node").encode;
  // this.decode = require("bindings")("woff2_decode.node").decode;
}

woff2.encode = require("bindings")("woff2_encode.node").encode;
woff2.decode = require("bindings")("woff2_decode.node").decode;
// woff2.encode = function(inFile, outFile) {
//   fs.writeFileSync(outFile, encode(fs.readFileSync(inFile)));
// };

// woff2.decode = function(inFile, outFile) {
//   fs.writeFileSync(outFile, decode(fs.readFileSync(inFile)));
// };

module.exports = woff2;

"use strict";

var fs = require("fs");
var encode = require("bindings")("woff2_encode.node").encode;
var decode = require("bindings")("woff2_decode.node").decode;

function woff2() {}

woff2.encode = function(inFile, outFile) {
  fs.writeFileSync(outFile, encode(fs.readFileSync(inFile)));
};

woff2.decode = function(inFile, outFile) {
  fs.writeFileSync(outFile, decode(fs.readFileSync(inFile)));
};

module.exports = woff2;

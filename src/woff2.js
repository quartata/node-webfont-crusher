'use strict';

function WOFF2() {}

/**
 * Convert WOFF2 data to TTF.
 *
 * @example
 * var woff2 = require('woff2');
 * var input = fs.readFileSync('something.woff2');
 * var output = 'output.ttf';
 * fs.writeFileSync(output, WOFF2.decode(input));
 *
 * @param {Buffer} data WOFF2 data to be decoded.
 * @returns {Buffer} Decoded TTF data.
 */
WOFF2.prototype.decode = require('bindings')('woff2_decode.node').decode;

/**
 * Convert TTF data to WOFF2.
 *
 * @example
 * var woff2 = require('woff2');
 * var input = fs.readFileSync('something.ttf');
 * var output = 'output.woff2';
 * fs.writeFileSync(output, WOFF2.encode(input));
 *
 * @param {Buffer} data TTF font data to be encoded.
 * @returns {Buffer} Encoded WOFF2 data.
 */
WOFF2.prototype.encode = require('bindings')('woff2_encode.node').encode;

module.exports = WOFF2;

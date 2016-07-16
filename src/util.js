'use strict';

const path = require('path');

/**
 * Helper functions.
 *
 * @namespace util
 */
function util() {}

/**
 * Turn a Node Buffer into an ArrayBuffer.
 *
 * @param {Buffer} buffer
 * @returns {ArrayBuffer}
 */
util.toArrayBuffer = (buffer) => {
  const view = new DataView(new ArrayBuffer(buffer.length), 0, buffer.length);
  for (let i = 0, l = buffer.length; i < l; i++) {
    view.setUint8(i, buffer[i], false);
  }
  return view.buffer;
};

/**
 * Turn an ArrayBuffer into a Node Buffer.
 *
 * @static
 *
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Buffer}
 */
util.toNodeBuffer = (arrayBuffer) => {
  const view = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
  const buffer = new Buffer(arrayBuffer.byteLength);
  for (let i = 0, l = arrayBuffer.byteLength; i < l; i++) {
    buffer[i] = view.getUint8(i, false);
  }
  return buffer;
};

/**
 * If a path starts with a tilde or $HOME env var, replace it with the user's
 * home directory.  This is probably not very robust but as far as I can tell
 * Node doesn't offer a similar utility.
 *
 * @static
 *
 * @param {string} _path Some filesystem path.
 * @returns {string} The same path with tildes or $HOME env var resolved (if
 *     there were any).
 */
util.resolveHome = (_path) => {
  if (_path[0] === '~') {
    return path.join(process.env.HOME, _path.slice(1));
  }
  return _path.replace(/^("|')?\$(\{)?HOME(\})?("|')?/g, process.env.HOME);
};

module.exports = util;

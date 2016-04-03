"use strict";

var Writer = require("./Writer.js");

module.exports = Crusher;

/**
 * @param {Object} config Configuration object.
 * @param {Object} config.data TTF data in fonteditor-core format.
 * @param {string} config.destination Output directory for generated font files.
 * @param {Object[]|undefined} [config.glyphs=undefined] An array strings or
 *     unicode codepoints (or both) that you want to keep in the output.  Leave
 *     undefined to keep all glyphs (convert only).
 * @param {string|undefined} [config.basename=undefined] Name that will be given
 *     to generated font files.  If undefined it will be the same as the input
 *     file.
 * @param {Object[]|undefined} [config.formats=undefined] An array of strings
 *     representing file formats you want to see in the output directory.  If
 *     undefined all possible conversions will take place.
 * @param {Function|undefined} [config.callback=undefined] Function that will be
 *     executed after files have been written.
 */
function Crusher(config) {
  // Although fonteditor-core supports just getting a subset of glyphs, it still
  // writes some data to the spot that the glyphs not in the subset would have
  // been.  By removing data from the character map and set of glyphs that it
  // knows about we can reduce the file size by half for small numbers of
  // glyphs!
  if (config.glyphs !== undefined) {
    var cmap = {};
    var glyf = [];
    Object.keys(config.data.cmap).forEach(function(value, index) {
      if (config.glyphs.indexOf(+value) > -1) {
        cmap[+value] = config.data.cmap[+value];
        glyf.push(config.data.glyf[config.data.cmap[+value]]);
      }
    });
    config.data.cmap = cmap;
    config.data.glyf = glyf;
  }

  new Writer(config);
}

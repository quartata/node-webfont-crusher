"use strict";

var Writer = require("./Writer.js");

/**
 * @param {Object} data TTF data in fonteditor-core format.
 * @param {Object} config Configuration object.
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
 */
function Crusher(data, config) {
  // Although fonteditor-core supports just getting a subset of glyphs, it still
  // writes some data to the spot that the glyphs not in the subset would have
  // been.  By removing data from the character map and set of glyphs that it
  // knows about we can reduce the file size by half for small numbers of
  // glyphs!
  if (config.glyphs !== undefined) {
    var cmap = {};
    var glyf = [];
    Object.keys(data.cmap).forEach(function(value, index) {
      if (config.glyphs.indexOf(+value) > -1) {
        cmap[+value] = data.cmap[+value];
        glyf.push(data.glyf[data.cmap[+value]]);
      }
    });
    data.cmap = cmap;
    data.glyf = glyf;
  }

  new Writer(data, config);
}

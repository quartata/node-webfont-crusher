"use strict";

var editor = require("fonteditor-core");
var formats = require("./formats.js");
var fs = require("fs");
var path = require("path");
var util = require("./util.js");
var woff2 = require("./woff2.js");

module.exports = Writer;

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
function Writer(data, config) {
  var _formats;
  if (config.formats === undefined) {
    _formats = formats.map(function(value) {
      return this[value];
    }.bind(this));
  } else {
    _formats = config.formats.map(function(value) {
      return this[value];
    }.bind(this));
  }

  _formats.map(function(value) {
    try {
      value();
    } catch (error) {
      console.log("Conversion failed.");
      throw(error);
    }
  });

  this.ttfBuffer = new editor.TTFWriter().write(data);
}

Writer.prototype.eot = function(data, config) {
  fs.writeFileSync(path.join(config.destination, config.basename + ".eot"),
                   util.toNodeBuffer(editor.ttf2eot(this.ttfBuffer)));
};

Writer.prototype.otf = function(data, config) {
  // TODO
};

Writer.prototype.svg = function(data, config) {
  fs.writeFileSync(path.join(config.destination, config.basename + ".svg"),
                   util.toNodeBuffer(editor.ttf2svg(this.ttfBuffer)));
};

Writer.prototype.ttf = function(data, config) {
  fs.writeFileSync(path.join(config.destination, config.basename + ".ttf"),
                   util.toNodeBuffer(this.ttfBuffer));
};

Writer.prototype.woff = function(data, config) {
  fs.writeFileSync(path.join(config.destination, config.basename + ".woff"),
                   util.toNodeBuffer(editor.ttf2woff(this.ttfBuffer)));
};

Writer.prototype.woff2 = function(data, config) {
  fs.writeFileSync(path.join(config.destination, config.basename + ".woff2"),
                   woff2.encode(data));
};

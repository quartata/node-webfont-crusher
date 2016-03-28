"use strict";

var Crusher = require("./Crusher.js");
var editor = require("fonteditor-core");
var formats = require("./formats.js");
var fs = require("fs");
var mime = require("mime");
var mkdirp = require("mkdirp");
var path = require("path");
var punycode = require("punycode");
var temp = require("temp").track();
var util = require("./util.js");
var woff2 = require("./woff2.js");

module.exports = Reader;

/**
 * @param {Object} config Configuration object.
 * @param {string} config.source Path to the source font file.
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
function Reader(config) {
  if ((typeof config) !== "object") {
    throw new TypeError("You need to provide at least config.source and " +
                        "config.destination.");
  }

  if (config.source !== undefined) {
    if (typeof config.source !== "string") {
      throw new TypeError("config.source must be a String.");
    } else if (!fs.lstatSync(fs.realpathSync(util.resolveHome(config.source)))
               .isFile()) {
      throw new TypeError("Expected config.source to be the path to a file.");
    }
  }

  if (config.destination !== undefined) {
    if (typeof config.source !== "string") {
      throw new TypeError("config.destination must be a String.");
    } else if (!fs.lstatSync(fs.realpathSync(util.resolveHome(config.destiation)))
               .isDirectory()) {
      try {
        mkdirp.sync(config.destination);
      } catch (error) {
        console.log("Could not create directory config.destination.  Please " +
                    "check that you have write permissions to the parent.");
        throw(error);
      }
    }
  }

  if (config.glyphs !== undefined) {
    if (!Array.isArray(config.glyphs)) {
      throw new TypeError("If config.glyphs is not undefined it must be an " +
                          "Array.");
    } else if (!(function() {
      for (var i = 0; i < config.glyphs.length; i++) {
        if ((typeof config.glyphs[i] !== "number")
            || (typeof config.glyphs[i] !== "string")) {
          return false;
        }
      }
      return true;
    })()) {
      throw new TypeError("Legal types for items in config.glyphs are " +
                          "\"number\" and \"string\".");
    }
  }

  if (config.basename !== undefined) {
    if (typeof config.basename !== "string") {
      throw new TypeError("If config.basename is not undefined it must be a " +
                          "String.");
    }
  } else {
    config.basename = path.basename(config.source, path.extname(config.source));
  }

  if (config.formats !== undefined) {
    if (!Array.isArray(config.formats)) {
      throw new TypeError("If config.formats is not undefined it must be an " +
                          "Array.");
    } else if (!(function() {
      for (var i = 0; i < config.formats.length; i++) {
        if ((typeof config.formats[i] !== "string")
            || (formats.indexOf(config.formats[i]) < 0)) {
          return false;
        }
      }
      return true;
    })()) {
      throw new TypeError("Items in config.formats must be of type \"string\"" +
                          "and be in Reader.formats.");
    } else {
      var _formats = [];
      config.formats.map(function(element, index) {
        if (typeof element === "string") {
          _formats.concat(punycode.ucs2.decode(element));
        } else formats.push(element);
      });

      config.formats = _formats.sort(function(a, b) {
        return ((a > b) ? 1 : ((a < b) ? -1 : 0));
      }).filter(function(element, index, array) {
        return (index === array.indexOf(element)) ? 1 : 0;
      });
    }
  }

  var mimetype = mime.lookup(config.source);
  var data = fs.readFileSync(config.source);
  switch (mimetype) {
  case "font/opentype":
    config.data = util.toArrayBuffer(data);
    this.otf(config);
    break;
  case "application/vnd.ms-fontobject":
    config.data = util.toArrayBuffer(data);
    this.eot(config);
    break;
  case "application/x-font-ttf":
    config.data = util.toArrayBuffer(data);
    this.ttf(config);
    break;
  case "application/font-woff":
    config.data = util.toArrayBuffer(data);
    this.woff(config);
    break;
  case"application/font-woff2":
    config.data = data;
    this.woff2(config);
    break;
  default:
    throw new Error("Not a supported font file: " + mimetype);
    break;
  }
}

Reader.prototype.eot = function(config) {
  new Crusher(new editor.TTFReader().read(editor.eot2ttf(config.data)), config);
};

Reader.prototype.otf = function(config) {
  new Crusher(
    new editor.TTFReader(
      editor.otf2ttfobject(new editor.OTFReader().read(
        config.data
      ))
    ),
    config);
};

Reader.prototype.svg = function(config) {
  // TODO
};

Reader.prototype.ttf = function(config) {
  new Crusher(new editor.TTFReader().read(config.data), config);
};

Reader.prototype.woff = function(config) {
  new Crusher(
    new editor.TTFReader().read(editor.woff2ttf(config.data)),
    config
  );
};

Reader.prototype.woff2 = function(config) {
  var fontObject;
  temp.mkdir("webfont-crusher", function(err, dirPath) {
    console.log("HI");
    var outputPath = path.join(dirPath, "output.ttf");
    if (err) throw err;
    fs.writeFileSync(outputPath, woff2.decode(config.data));
    config.data = util.toArrayBuffer(fs.readFileSync(outputPath));
    new Crusher(new editor.TTFReader().read(config.data), config);
  });
};

'use strict';

const Crusher = require('./Crusher.js');
const editor = require('fonteditor-core');
const formats = require('./formats.js');
const fs = require('fs');
const mmmagic = require('mmmagic');
const mime = require('mime');
const mkdirp = require('mkdirp');
const path = require('path');
const punycode = require('punycode');
const temp = require('temp').track();
const util = require('./util.js');
const woff2 = require('./woff2.js');
const strings = require('./strings.js');

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
 * @param {Function|undefined} [config.callback=undefined] Function that will be
 *     executed after files have been written.
 */
class Reader {
  constructor(config) {
    this.config = config;
    temp.track();

    if ((typeof config) !== 'object') {
      throw new TypeError(strings.noConfigurationObject);
    }

    if (config.source === undefined && config.destination === undefined) {
      throw new TypeError(strings.noRequiredArguments);
    }

    if (typeof config.source !== 'string') {
      throw new TypeError(strings.source.notString);
    } else {
      try {
        if (!fs.lstatSync(fs.realpathSync(util.resolveHome(config.source)))
            .isFile()) {
          // File is actually a directory or something else.
          throw new TypeError(strings.source.notFile);
        }
      } catch (e) {
        if (e.code === 'ENOENT') {
          // File doesn't exist at all.
          throw new TypeError(strings.source.notFile);
        } else {
          throw e;
        }
      }
    }

    if (typeof config.destination !== 'string') {
      throw new TypeError(strings.destination.notString);
    } else {
      try {
        if (!fs.lstatSync(fs.realpathSync(
          util.resolveHome(config.destination))).isDirectory()) {
          // File exists but is not a directory.
          throw new TypeError(strings.destination.notDirectory);
        }
      } catch (e) {
        if (e.code === 'ENOENT' || e.code === 'EACCES') {
          try {
            mkdirp.sync(config.destination);
          } catch (e) { // eslint-disable-line no-shadow
            throw new Error(strings.destination.notWriteable);
          }
        } else {
          throw e;
        }
      }
    }

    if (config.glyphs !== undefined) {
      if (!Array.isArray(config.glyphs)) {
        throw new TypeError(strings.glyphs.notArray);
      } else if (!(() => {
        for (let i = 0; i < config.glyphs.length; i++) {
          if ((typeof config.glyphs[i] !== 'number')
              || (typeof config.glyphs[i] !== 'string')) {
            return false;
          } else if (typeof config.glyphs[i] === 'number'
                     && isNaN(config.glyphs[i])) {
            return false;
          }
        }
        return true;
      })()) {
        throw new TypeError(strings.glyphs.notNumberOrString);
      }
    }

    if (config.basename === undefined) {
      this.config.basename =
        path.basename(config.source, path.extname(config.source));
    } else if (typeof config.basename !== 'string') {
      throw new TypeError(strings.basename.notString);
    }

    if (config.formats !== undefined) {
      if (!Array.isArray(config.formats)) {
        throw new TypeError(strings.formats.notArray);
      } else if (!(() => {
        for (let i = 0; i < config.formats.length; i++) {
          if ((typeof config.formats[i] !== 'string')) {
            return false;
          }
        }
        return true;
      })()) {
        throw new TypeError(strings.formats.notString);
      } else if (!(() => {
        for (let i = 0; i < config.formats.length; i++) {
          if ((formats.indexOf(config.formats[i]) < 0)) {
            return false;
          }
        }
        return true;
      })()) {
        throw new TypeError(strings.formats.notValidFormat);
      } else {
        this.config.formats =
          [].concat.apply([], config.formats.map((element) => {
            if (typeof element === 'string') {
              return punycode.ucs2.decode(element);
            } return element;
          })).sort((a, b) => ((a > b) ? 1 : ((a < b) ? -1 : 0)))
          .filter((element, index, array) =>
                  (index === array.indexOf(element)) ? 1 : 0);
      }
    }

    if (config.callback !== undefined) {
      if (typeof config.callback !== 'function') {
        throw new TypeError(strings.callback.notFunction);
      }
    }

    const magic = new mmmagic.Magic(mmmagic.MAGIC_MIME_TYPE);
    const data = fs.readFileSync(config.source);
    const choose = (mimetype) => {
      switch (mimetype) {
        case 'application/vnd.ms-fontobject':
          this.config.data = util.toArrayBuffer(data);
          this.eot();
          break;
        case 'font/opentype':
          this.config.data = util.toArrayBuffer(data);
          this.otf();
          break;
        case 'image/svg+xml':
          this.config.data = String(data);
          this.svg();
          break;
        case 'application/x-font-ttf':
          this.config.data = util.toArrayBuffer(data);
          this.ttf();
          break;
        case 'application/font-woff':
          this.config.data = util.toArrayBuffer(data);
          this.woff();
          break;
        case 'application/font-woff2':
          this.config.data = data;
          this.woff2();
          break;
        default:
          throw new Error(`Couldn't identify font file: ${config.source}`);
      }
    };

    // Try to determine the file type by data inspection.
    magic.detectFile(config.source, (err, result) => {
      if (err) throw err;
      try {
        choose(result);
      } catch (error) {
        // Well, we tried.  If we got application/octet-stream or similar,
        // fallback to looking up the mime type of the file extension.
        choose(mime.lookup(config.source));
      }
    });
  }

  eot() {
    // I don't think it's possible to accept eot as an input :(
    this.config.data = new editor.TTFReader().read(editor.eot2ttf(this.config.data));
    return new Crusher(this.config);
  }

  otf() {
    this.config.data =
      editor.otf2ttfobject(new editor.OTFReader().read(this.config.data));
    return new Crusher(this.config);
  }

  svg() {
    // TODO - fonteditor-core support for SVG is flaky, look into svg2ttf
    // https://github.com/fontello/svg2ttf
    this.config.data = editor.svg2ttfobject(this.config.data);
    return new Crusher(this.config);
  }

  ttf() {
    this.config.data = new editor.TTFReader().read(this.config.data);
    return new Crusher(this.config);
  }

  woff() {
    this.config.data = new
    editor.TTFReader().read(editor.woff2ttf(this.config.data, {
      inflate: require('pako').inflate
    }));
    return new Crusher(this.config);
  }

  woff2() {
    temp.mkdir('webfont-crusher', (err, dirPath) => {
      const outputPath = path.join(dirPath, 'output.ttf');
      if (err) throw err;
      fs.writeFileSync(outputPath, woff2.decode(this.config.data));
      this.config.data = util.toArrayBuffer(fs.readFileSync(outputPath));
      this.config.data = new editor.TTFReader().read(this.config.data);
      return new Crusher(this.config);
    });
  }
}

module.exports = Reader;

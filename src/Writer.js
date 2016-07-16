'use strict';

const editor = require('fonteditor-core');
const formats = require('./formats.js');
const fs = require('fs');
const path = require('path');
const util = require('./util.js');
const woff = require('sfnt2woff-zopfli');
const woff2 = require('woff2');

editor.string = require.cache[require.resolve('fonteditor-core')]
  .require('./common/string.js');

/**
 * @param {Object} data TTF data in fonteditor-core format.
 * @param {Object} config Configuration object.
 * @param {string} config.destination Output directory for generated font files.
 * @param {Object[]|undefined} [config.glyphs=undefined] An array of strings or
 *     unicode codepoints (or both) that you want to keep in the output.  Leave
 *     undefined to keep all glyphs (convert only).
 * @param {string|undefined} [config.basename=undefined] Name that will be given
 *     to generated font files.  If undefined it will be the same as the input
 *     file.
 * @param {Object[]|undefined} [config.formats=undefined] An array of strings
 *     representing file formats you want to see in the output directory.  If
 *     undefined all possible conversions will take place.
 * @param {Object[]|undefined} [config.scss=undefined] If not undefined, the
 *     path to an SCSS file that will be written.
 * @param {Function|undefined} [config.callback=undefined] Function that will be
 *     executed after files have been written.
 */
class Writer {
  constructor(config) {
    this.config = config;
    let _formats;
    if (config.formats === undefined) {
      this.config.formats = formats.filter((format) => format !== 'otf');
      _formats = this.config.formats.map((value) => this[value]);
    } else {
      _formats = config.formats.map((value) => this[value]);
    }

    // uniqueSubFamily will be used as the ID for SVG output, so make sure that
    // it is valid.
    // See: https://www.w3.org/TR/REC-html40/types.html#type-name
    this.config.data.name.uniqueSubFamily =
      config.basename.replace(/^[^A-Za-z]/, 'a')
      .replace(/[^A-Za-z0-9-_:.]/g, '-');

    // Get the unicode range of the font.  This is a bit dumb since it only
    // looks at the first and last characters (by codepoint), if you specify
    // only two glyphs that are not contiguous there will be empty space between
    // them.  It's probably better than nothing.
    //
    // See:
    // https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range
    const firstCharIndex = editor.string.pad(
      this.config.data['OS/2'].usFirstCharIndex.toString(16), 4);
    const lastCharIndex = editor.string.pad(
      this.config.data['OS/2'].usLastCharIndex.toString(16), 4);
    this.config.unicodeRange = `U+${firstCharIndex}-${lastCharIndex}`;

    this.config.ttfBuffer = new editor.TTFWriter().write(this.config.data);

    _formats.forEach((value) => {
      try {
        (value.bind(this))();
      } catch (error) { // eslint-disable-next-line no-console
        console.log(`${formats[_formats.indexOf(value)]}: Conversion failed.`);
        throw (error);
      }
    });

    if (config.scss) this.scss();
    if (config.callback) config.callback();
  }

  eot() {
    fs.writeFileSync(path.join(this.config._destination,
                               `${this.config.basename}.eot`),
                     util.toNodeBuffer(editor.ttf2eot(this.config.ttfBuffer)));
  }

  otf() {
    throw new Error('OTF not supported as an output format. :(');
  }

  svg() {
    fs.writeFileSync(path.join(this.config._destination,
                               `${this.config.basename}.svg`),
                     editor.ttf2svg(this.config.ttfBuffer));
  }

  ttf() {
    fs.writeFileSync(path.join(this.config._destination,
                               `${this.config.basename}.ttf`),
                     util.toNodeBuffer(
                       this.config.ttfBuffer));
  }

  woff() {
    fs.writeFileSync(path.join(this.config._destination,
                               `${this.config.basename}.woff`),
                     woff.encode(util.toNodeBuffer(
                       this.config.ttfBuffer)));
  }

  woff2() {
    fs.writeFileSync(path.join(this.config._destination,
                               `${this.config.basename}.woff2`),
                     woff2.encode(util.toNodeBuffer(
                       this.config.ttfBuffer)));
  }

  scss() {
    // eslint-disable-next-line prefer-template
    const _formats = this.config.formats.map((extension) => {
      const format = ((extension === 'eot')
                    ? 'embedded-opentype'
                    : ((extension === 'ttf')
                       ? 'truetype' : extension));
      return `url("#{$wc-font-path}/${this.config.basename}.${extension}") format(${format})`;
    }).join(',\n    ') + ';';

    const template = `$wc-font-path: "${this.config.destination}" !default;

@font-face {
  font-family: "${this.config.basename}";
  src: ${_formats}
  font-weight: normal;
  font-style: normal;
  unicode-range: ${this.config.unicodeRange};
}

`;

    fs.writeFileSync(this.config.scss, template);
  }
}

module.exports = Writer;

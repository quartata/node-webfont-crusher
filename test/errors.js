'use strict';

const crush = require('../src/index');
const formats = require('../src/formats');
const fs = require('fs');
const path = require('path');
const sampleFontPath = './node_modules/font-awesome/fonts';
const strings = require('../src/strings');
const temp = require('temp').track();
const test = require('tap').test;

test('config must be an object.', (t) => {
  t.throws(() => crush(), new TypeError(strings.noConfigurationObject));
  t.end();
});

test('config must have properties source and destination.', (t) => {
  t.throws(() => crush({}), new TypeError(strings.noRequiredArguments));
  t.end();
});

test('config.source must be a string.', (t) => {
  t.throws(() => crush({
    source: 42
  }), new TypeError(strings.source.notString));
  t.throws(() => crush({
    source: true
  }), new TypeError(strings.source.notString));
  t.throws(() => crush({
    source: null
  }), new TypeError(strings.source.notString));
  t.throws(() => crush({
    source: {}
  }), new TypeError(strings.source.notString));
  t.end();
});

test('config.source must be the path to a file.', (t) => {
  temp.mkdir('webfont-crusher', (err, dirPath) => {
    if (err) throw err;
    t.throws(() => crush({
      source: dirPath
    }), new TypeError(strings.source.notFile));
    t.throws(() => crush({
      source: path.join(dirPath, 'nothing')
    }), new TypeError(strings.source.notFile));
    temp.cleanupSync();
    t.end();
  });
});

test('config.destination must be a string.', (t) => {
  t.throws(() => crush({
    source: `${sampleFontPath}/fontawesome-webfont.ttf`,
    destination: 42
  }), new TypeError(strings.destination.notString));
  t.throws(() => crush({
    source: `${sampleFontPath}/fontawesome-webfont.ttf`,
    destination: true
  }), new TypeError(strings.destination.notString));
  t.throws(() => crush({
    source: `${sampleFontPath}/fontawesome-webfont.ttf`,
    destination: null
  }), new TypeError(strings.destination.notString));
  t.throws(() => crush({
    source: `${sampleFontPath}/fontawesome-webfont.ttf`,
    destination: {}
  }), new TypeError(strings.destination.notString));
  t.end();
});

test('config.destination must be a directory.', (t) => {
  temp.mkdir('webfont-crusher', (err, dirPath) => {
    const tempFile = path.join(dirPath, 'existing-file');
    fs.writeFileSync(tempFile);
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: tempFile
    }), new TypeError(strings.destination.notDirectory));
    temp.cleanupSync();
    t.end();
  });
});

test('If config.destination does not exist it must be writable.', (t) => {
  temp.mkdir('webfont-crusher', (err, dirPath) => {
    const tempDir = path.join(dirPath, 'tmp');
    t.throws(() => {
      fs.mkdirSync(tempDir, 0o444);
      return crush({
        source: `${sampleFontPath}/fontawesome-webfont.ttf`,
        destination: (path.join(tempDir, 'nothing'))
      });
    }, new Error(strings.destination.notWriteable));
    temp.cleanupSync();
    t.end();
  });
});

test('If config.glyphs is defined it must be an Array.', (t) => {
  temp.mkdir('webfont-crusher', (err, dirPath) => {
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      glyphs: 42
    }), new TypeError(strings.glyphs.notArray));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      glyphs: true
    }), new TypeError(strings.glyphs.notArray));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      glyphs: null
    }), new TypeError(strings.glyphs.notArray));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      glyphs: {}
    }), new TypeError(strings.glyphs.notArray));
    temp.cleanupSync();
    t.end();
  });
});

test('Items in config.glyphs must be "number" or "string".', (t) => {
  temp.mkdir('webfont-crusher', (err, dirPath) => {
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      glyphs: [NaN]
    }), new TypeError(strings.glyphs.notNumberOrString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      glyphs: [true]
    }), new TypeError(strings.glyphs.notNumberOrString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      glyphs: [undefined]
    }), new TypeError(strings.glyphs.notNumberOrString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      glyphs: [null]
    }), new TypeError(strings.glyphs.notNumberOrString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      glyphs: [{}]
    }), new TypeError(strings.glyphs.notNumberOrString));
    temp.cleanupSync();
    t.end();
  });
});

test('If config.basename is not undefined it must be a string.', (t) => {
  temp.mkdir('webfont-crusher', (err, dirPath) => {
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      basename: 42,
    }), new TypeError(strings.basename.notString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      basename: true
    }), new TypeError(strings.basename.notString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      basename: null
    }), new TypeError(strings.basename.notString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      basename: {}
    }), new TypeError(strings.basename.notString));
    temp.cleanupSync();
    t.end();
  });
});


test('If config.formats is not undefined it must be an Array.', (t) => {
  temp.mkdir('webfont-crusher', (err, dirPath) => {
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      formats: 42
    }), new TypeError(strings.formats.notArray));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      formats: true
    }), new TypeError(strings.formats.notArray));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      formats: null
    }), new TypeError(strings.formats.notArray));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      formats: {}
    }), new TypeError(strings.formats.notArray));
    temp.cleanupSync();
    t.end();
  });
});

test('Items in config.formats must be of type "string".', (t) => {
  temp.mkdir('webfont-crusher', (err, dirPath) => {
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      formats: [42]
    }), new TypeError(strings.formats.notString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      formats: [true]
    }), new TypeError(strings.formats.notString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      formats: [undefined]
    }), new TypeError(strings.formats.notString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      formats: [null]
    }), new TypeError(strings.formats.notString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      formats: [{}]
    }), new TypeError(strings.formats.notString));
    temp.cleanupSync();
    t.end();
  });
});

test(`Items in config.formats must be in ${formats.join(', ')}.`, (t) => {
  temp.mkdir('webfont-crusher', (err, dirPath) => {
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      formats: ['woff2', 'foo', 'bar']
    }), new TypeError(strings.formats.notValidFormat));
    temp.cleanupSync();
    t.end();
  });
});

test('If config.scss is defined it must be a string.', (t) => {
  temp.mkdir('webfont-crusher', (err, dirPath) => {
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      scss: 42
    }), new TypeError(strings.scss.notString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      scss: true
    }), new TypeError(strings.scss.notString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      scss: null
    }), new TypeError(strings.scss.notString));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      scss: {}
    }), new TypeError(strings.scss.notString));
    t.end();
  });
});

test('If config.scss is not undefined its parent must be writable.', (t) => {
  temp.mkdir('webfont-crusher', (err, dirPath) => {
    t.throws(() => {
      fs.mkdirSync(path.join(dirPath, 'scss'), 0o444);
      return crush({
        source: `${sampleFontPath}/fontawesome-webfont.ttf`,
        destination: dirPath,
        scss: path.join(path.join(dirPath, 'scss'), 'nothing.scss')
      });
    }, new Error(strings.scss.notWriteable));
    temp.cleanupSync();
    t.end();
  });
});

test('If config.callback is not undefined it must be a function.', (t) => {
  temp.mkdir('webfont-crusher', (err, dirPath) => {
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      callback: 42
    }), new TypeError(strings.callback.notFunction));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      callback: true
    }), new TypeError(strings.callback.notFunction));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      callback: 'nothing'
    }), new TypeError(strings.callback.notFunction));
    t.throws(() => crush({
      source: `${sampleFontPath}/fontawesome-webfont.ttf`,
      destination: dirPath,
      callback: {}
    }), new TypeError(strings.callback.notFunction));
    temp.cleanupSync();
    t.end();
  });
});

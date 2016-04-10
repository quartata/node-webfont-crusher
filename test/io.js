'use strict';

const Reader = require('../src/Reader.js');
const basePath = './node_modules/font-awesome/fonts';
const formats = require('../src/formats.js');
const fs = require('fs');
const path = require('path');
const temp = require('temp');
const test = require('tap').test;

formats.filter((format) => format !== 'eot')
  .forEach((format) => test(`IO: ${format}`, (t) => {
    temp.mkdir('webfont-crusher', (err, dirPath) => {
      if (err) throw err;
      const config = {
        source: format === 'otf'
          ? `${basePath}/FontAwesome.otf`
          : `${basePath}/fontawesome-webfont.${format}`,
        destination: dirPath,
        callback: () => {
          const files = fs.readdirSync(dirPath);
          process.stdout.write(`IO: ${format}: ` +
                               'The following files were created:\n');
          files.forEach((file) => {
            const bytes = fs.statSync(path.join(dirPath, file)).size;
            process.stdout.write(`${file}:\t${bytes} bytes\n`);
          });
          t.end();
        },
      };
      t.ok(new Reader(config));
    });
  }));

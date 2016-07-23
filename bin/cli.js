#!/usr/bin/env node

const crush = require('../src/index.js');
const argv = require('yargs')
        .require('i')
        .alias('i', 'input')
        .describe('i', 'Path to input file.')
        .require('o')
        .alias('o', 'output')
        .describe('o', 'Path to output directory.')
        .alias('g', 'glyphs')
        .describe('g', 'Subset of glyphs to keep.')
        .alias('n', 'basename')
        .describe('n', 'Base name for output files.')
        .alias('f', 'formats')
        .describe('f', 'Desired output formats.')
        .alias('s', 'scss')
        .describe('s', 'Path to SCSS output file.')
        .check((args) => {
          if (Array.isArray(args.i)) {
            throw new TypeError('Please specify one input file only.');
          } else if (Array.isArray(args.o)) {
            throw new TypeError('Please specify one output directory only.');
          } else if (Array.isArray(args.n)) {
            throw new TypeError('Please specify one basename only.');
          } else if (Array.isArray(args.s)) {
            throw new TypeError('Please specify one SCSS path only.');
          } else {
            return true;
          }
        }).argv;

crush({
  source: (argv.input || argv.i),
  destination: (argv.output || argv.o),
  glyphs: (argv.glyphs || argv.g || undefined) === undefined
    ? undefined
    : [].concat.apply([], [argv.glyphs || argv.g]),
  basename: (argv.basename || argv.n || undefined),
  formats: (argv.formats || argv.f || undefined) === undefined
    ? undefined
    : [].concat.apply([], [argv.formats || argv.f]),
  scss: (argv.scss || argv.s || undefined)
});

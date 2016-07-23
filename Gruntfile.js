'use strict';

const template = `# node-webfont-crusher

Get just the glyphs your site needs from a font.

## Example use case:

You have: a TTF, OTF, SVG, WOFF or WOFF2 font.

You want: a tiny subset of the glyphs in some or all of those formats.

For example, Font Awesome is awesome, but it's also huge:

\`\`\`
$ du -h ./*
108K	FontAwesome.otf
72K	fontawesome-webfont.eot
360K	fontawesome-webfont.svg
140K	fontawesome-webfont.ttf
84K	fontawesome-webfont.woff
68K	fontawesome-webfont.woff2
\`\`\`

That's a big download if you just want one or two glyphs.

All you need to know is the unicode codepoints of the glyphs you want to keep,
everything else will be discarded.

There are a bunch of web services that can do this for you, but I wanted
something more programmatic.

Strictly speaking, you don't have to do any crushing.  If you leave
\`config.glyphs\` undefined only conversions will take place.

## Usage

You probably want the Grunt plugin.  Otherwise there's a rudimentary command
line interface.  Check out \`./bin/cli.js\`.

## Caveats

EOT is not supported as an input format and OTF is not supported as an output
format.

## Special thanks

Really this is just a convenience wrapper around a bunch of other tools.  If
this project is cool it's because these projects exist:

- [\`fonteditor-core\`](https://github.com/kekee000/fonteditor-core)

  I can't read Chinese but I think it's the backend for
  [Baidu's online font editor](http://font.baidu.com/editor/index-en.html).

- [\`sfnt2woff-zopfli\`](https://github.com/bramstein/sfnt2woff-zopfli)

  An awesome \`woff\` encoder/decoder.

- [\`woff2\`](https://github.com/google/woff2)

  An awesome \`woff2\` encoder/decoder.

- [\`ttf2woff2\`](https://github.com/nfroidure/ttf2woff2)

  This project is a Node wrapper around Google's
  [\`woff2\`](https://github.com/google/woff2) project.  It only allows for
  encoding (I wanted to be able to encode and decode), but I reused a lot of the
  code for the \`woff2\` wrapper!

# API Reference

{{>all-docs~}}`;

module.exports = (grunt) => {
  grunt.initConfig({
    clean: ['./README.md'],
    eslint: {
      target: [
        './src/**/*.js',
        './test/**/*.js'
      ]
    },
    jsdoc2md: {
      withOptions: {
        options: {
          template
        },
        src: 'src/*.js',
        dest: './README.md'
      }
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
  grunt.registerTask('default', [
    'eslint',
    'clean',
    'jsdoc2md'
  ]);
};

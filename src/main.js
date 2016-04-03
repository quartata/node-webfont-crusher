#!/usr/bin/env node
"use strict";

// TODO: Make directories for output path if necessary.
// TODO: Additional config parameters: generate sass predicate, generate
//       less predicate, generate css predicate.
// TODO: Grunt/gulp plugin.
// TODO: Make it work on the command line as well (like Browserify).

var Reader = require("./Reader.js");
var argv = require("yargs").argv;
var editor = require("fonteditor-core");
var fs = require("fs");
var mime = require("mime");
var path = require("path");
var temp = require("temp").track();
var woff2 = require("./woff2");

// Get access to some utility functions not exposed by opentype.js
// var util = require.cache[require.resolve("opentype.js")].require("./util");

if (argv.input || argv.i) {
  var config = {
    source: (argv.input || argv.i),
    destination: "./out"
  };
  console.log(config);

  new Reader(config);
}

// application/x-font-ttf

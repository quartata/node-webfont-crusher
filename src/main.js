#!/usr/bin/env node

"use strict";

// todo: make directories for output path if necessary
// parameters: input font, desired glyphs (unicode ids), output path, output filename,
// generate sass predicate, generate less predicate, generate css predicate

var fs = require("fs");
var ttf2woff2 = require("ttf2woff2");
var editor = require("fonteditor-core");
var mime = require("mime");
var ttf2svg = require("ttf2svg");
var argv = require("yargs").argv;


// Get access to some utility functions not exposed by opentype.js
// var util = require.cache[require.resolve("opentype.js")].require("./util");
// var util = require.cache[require.resolve("fonteditor-core")].require("./glyf");

// fa-clock-o is unicode f017, 61463 in base 10.
// the name of the glyph is "time" though.
// looks like the better way to address the glyph will be by its unicode id.

var targetGlyphs = [0xf017, 0xf018, 0xf019, 0xf020];
var lang = "en";

function Crusher() {
    // read in otf data
    var fontObject = new editor.OTFReader({subset: targetGlyphs})
        .read(toArrayBuffer(fs.readFileSync("FontAwesome.otf")));
    // Although fonteditor-core supports just getting a subset of glyphs, it still
    // writes some data to the spot that the glyphs not in the subset would have
    // been.  By removing data from the character map and set of glyphs that it
    // knows about we can reduce the file size by half for small numbers of glyphs!
    // var cmap = {};
    // var glyf = [];
    // Object.keys(fontObject.cmap).forEach(function(value, index) {
    //     if (targetGlyphs.indexOf(+value) > -1) {
    //         cmap[+value] = fontObject.cmap[+value];
    //         glyf.push(fontObject.glyf[fontObject.cmap[+value]]);
    //     }
    // });
    // fontObject.cmap = cmap;
    // fontObject.glyf = glyf;

    var ttfBuffer = new editor.TTFWriter().write(editor.otf2ttfobject(fontObject));
    fs.writeFileSync("test.ttf", toNodeBuffer(ttfBuffer));
    fs.writeFileSync("test.eot", toNodeBuffer(editor.ttf2eot(ttfBuffer)));
    fs.writeFileSync("test.woff", toNodeBuffer(editor.ttf2woff(ttfBuffer)));
    fs.writeFileSync("test.woff2", fs.readFileSync("test.ttf"));
    fs.writeFileSync("test.svg", ttf2svg(fs.readFileSync("test.ttf")));

    function toArrayBuffer(buffer) {
        var view = new DataView(new ArrayBuffer(buffer.length), 0, buffer.length);
        for (var i = 0, l = buffer.length; i < l; i++) {
            view.setUint8(i, buffer[i], false);
        }
        return view.buffer;
    }

    function toNodeBuffer(arrayBuffer) {
        var view = new DataView(arrayBuffer, 0, arrayBuffer.byteLength);
        var buffer = new Buffer(arrayBuffer.byteLength);
        for (var i = 0, l = arrayBuffer.byteLength; i < l; i++) {
            buffer[i] = view.getUint8(i, false);
        }
        return buffer;
    }
}

console.log(mime.lookup(argv.file));
// application/x-font-ttf

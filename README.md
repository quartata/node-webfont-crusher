# node-webfont-crusher

Get just the glyphs your site needs from a font.

## Example use case:

You have: a TTF, OTF, SVG, WOFF or WOFF2 font.

You want: a tiny subset of the glyphs in some or all of those formats.

For example, Font Awesome is awesome, but it's also huge:

```
$ du -h ./*
108K FontAwesome.otf
72K  fontawesome-webfont.eot
360K fontawesome-webfont.svg
140K fontawesome-webfont.ttf
84K  fontawesome-webfont.woff
68K  fontawesome-webfont.woff2
```

That's a big download if you just want one or two glyphs.

All you need to know is the unicode codepoints of the glyphs you want to keep,
everything else will be discarded.

There are a bunch of web services that can do this for you, but I wanted
something more programmatic.

Strictly speaking, you don't have to do any crushing.  If you leave
`config.glyphs` undefined only conversions will take place.

## Usage

You probably want the Grunt plugin.  Otherwise there's a rudimentary command
line interface.  Check out `./bin/cli.js`.

If you didn't install with `-g` you can run `webfont-crusher` from your
`node_modules` directory (`./node_modules/.bin/webfont-crusher`).

### Just convert

```
$ webfont-crusher -i ./node_modules/font-awesome/fonts/FontAwesome.otf -o ./
```

### Convert to some specific formats

```
$ webfont-crusher -i ./node_modules/font-awesome/fonts/FontAwesome.otf   -o ./   -f woff -f woff2
```

### Convert to a specific format and crush

```
$ webfont-crusher -i ./node_modules/font-awesome/fonts/FontAwesome.otf   -o ./   -g 0xf2ae -g 61459   -f woff2

$ webfont-crusher -i /usr/share/fonts/TTF/DejaVuSansMono.ttf   -o ./   -g '1234567890.,'   -f woff2
```

### Convert to a specific format with a different name

```
$ webfont-crusher -i ./node_modules/font-awesome/fonts/FontAwesome.otf   -o ./   -f woff2   -n font-awesome
```

### Convert to a specific formats and get an SCSS partial you can `@import`

```
$ webfont-crusher -i /usr/share/fonts/TTF/DejaVuSansMono.ttf   -o ./   -f woff2   -s ./_fonts.scss
```

## Caveats

- EOT is not supported as an input format and OTF is not supported as an output
  format.

- The command line interface won't let you pass just numbers right now
  (`-g '1234567890'`) because it will be interpreted as a codepoint.  If you
  really just want numerals a dodgy workaround is just to include a space so
  that it will be parsed as a string (`-g ' 1234567890'`).

## Special thanks

Really this is just a convenience wrapper around a bunch of other tools.  If
this project is cool it's because these projects exist:

- [`fonteditor-core`](https://github.com/kekee000/fonteditor-core)

  I can't read Chinese but I think it's the backend for
  [Baidu's online font editor](http://font.baidu.com/editor/index-en.html).

- [`sfnt2woff-zopfli`](https://github.com/bramstein/sfnt2woff-zopfli)

  An awesome `woff` encoder/decoder.

- [`woff2`](https://github.com/google/woff2)

  An awesome `woff2` encoder/decoder.

- [`ttf2woff2`](https://github.com/nfroidure/ttf2woff2)

  This project is a Node wrapper around Google's
  [`woff2`](https://github.com/google/woff2) project.  It only allows for
  encoding (I wanted to be able to encode and decode), but I reused a lot of the
  code for the `woff2` wrapper!

# API Reference

<a name="Crusher"></a>

## Crusher
**Kind**: global class  
<a name="new_Crusher_new"></a>

### new Crusher(config)

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Configuration object. |
| config.data | <code>Object</code> | TTF data in fonteditor-core format. |
| config.destination | <code>string</code> | Output directory for generated font files. |
| [config.glyphs] | <code>Array.&lt;Object&gt;</code> &#124; <code>undefined</code> | An array of strings or     unicode codepoints (or both) that you want to keep in the output.  Leave     undefined to keep all glyphs (convert only). |
| [config.basename] | <code>string</code> &#124; <code>undefined</code> | Name that will be given     to generated font files.  If undefined it will be the same as the input     file. |
| [config.formats] | <code>Array.&lt;Object&gt;</code> &#124; <code>undefined</code> | An array of strings     representing file formats you want to see in the output directory.  If     undefined all possible conversions will take place. |
| [config.scss] | <code>Array.&lt;Object&gt;</code> &#124; <code>undefined</code> | If not undefined, the     path to an SCSS file that will be written. |
| [config.callback] | <code>function</code> &#124; <code>undefined</code> | Function that will be     executed after files have been written. |

<a name="Reader"></a>

## Reader
**Kind**: global class  
<a name="new_Reader_new"></a>

### new Reader(config)

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Configuration object. |
| config.source | <code>string</code> | Path to the source font file. |
| config.destination | <code>string</code> | Output directory for generated font files. |
| [config.glyphs] | <code>Array.&lt;Object&gt;</code> &#124; <code>undefined</code> | An array of strings or     unicode codepoints (or both) that you want to keep in the output.  Leave     undefined to keep all glyphs (convert only). |
| [config.basename] | <code>string</code> &#124; <code>undefined</code> | Name that will be given     to generated font files.  If undefined it will be the same as the input     file. |
| [config.formats] | <code>Array.&lt;Object&gt;</code> &#124; <code>undefined</code> | An array of strings     representing file formats you want to see in the output directory.  If     undefined all possible conversions will take place. |
| [config.scss] | <code>Array.&lt;Object&gt;</code> &#124; <code>undefined</code> | If not undefined, the     path to an SCSS file that will be written. |
| [config.callback] | <code>function</code> &#124; <code>undefined</code> | Function that will be     executed after files have been written. |

<a name="Writer"></a>

## Writer
**Kind**: global class  
<a name="new_Writer_new"></a>

### new Writer(data, config)

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | TTF data in fonteditor-core format. |
| config | <code>Object</code> | Configuration object. |
| config.destination | <code>string</code> | Output directory for generated font files. |
| [config.glyphs] | <code>Array.&lt;Object&gt;</code> &#124; <code>undefined</code> | An array of strings or     unicode codepoints (or both) that you want to keep in the output.  Leave     undefined to keep all glyphs (convert only). |
| [config.basename] | <code>string</code> &#124; <code>undefined</code> | Name that will be given     to generated font files.  If undefined it will be the same as the input     file. |
| [config.formats] | <code>Array.&lt;Object&gt;</code> &#124; <code>undefined</code> | An array of strings     representing file formats you want to see in the output directory.  If     undefined all possible conversions will take place. |
| [config.scss] | <code>Array.&lt;Object&gt;</code> &#124; <code>undefined</code> | If not undefined, the     path to an SCSS file that will be written. |
| [config.callback] | <code>function</code> &#124; <code>undefined</code> | Function that will be     executed after files have been written. |

<a name="util"></a>

## util : <code>object</code>
Helper functions.

**Kind**: global namespace  

* [util](#util) : <code>object</code>
    * [.toArrayBuffer(buffer)](#util.toArrayBuffer) ⇒ <code>ArrayBuffer</code>
    * [.toNodeBuffer(arrayBuffer)](#util.toNodeBuffer) ⇒ <code>Buffer</code>
    * [.resolveHome(_path)](#util.resolveHome) ⇒ <code>string</code>

<a name="util.toArrayBuffer"></a>

### util.toArrayBuffer(buffer) ⇒ <code>ArrayBuffer</code>
Turn a Node Buffer into an ArrayBuffer.

**Kind**: static method of <code>[util](#util)</code>  

| Param | Type |
| --- | --- |
| buffer | <code>Buffer</code> | 

<a name="util.toNodeBuffer"></a>

### util.toNodeBuffer(arrayBuffer) ⇒ <code>Buffer</code>
Turn an ArrayBuffer into a Node Buffer.

**Kind**: static method of <code>[util](#util)</code>  

| Param | Type |
| --- | --- |
| arrayBuffer | <code>ArrayBuffer</code> | 

<a name="util.resolveHome"></a>

### util.resolveHome(_path) ⇒ <code>string</code>
If a path starts with a tilde or $HOME env var, replace it with the user's
home directory.  This is probably not very robust but as far as I can tell
Node doesn't offer a similar utility.

**Kind**: static method of <code>[util](#util)</code>  
**Returns**: <code>string</code> - The same path with tildes or $HOME env var resolved (if
    there were any).  

| Param | Type | Description |
| --- | --- | --- |
| _path | <code>string</code> | Some filesystem path. |

;

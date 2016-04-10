
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
| [config.glyphs] | <code>Array.&lt;Object&gt;</code> &#124; <code>undefined</code> | An array strings or     unicode codepoints (or both) that you want to keep in the output.  Leave     undefined to keep all glyphs (convert only). |
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
| [config.glyphs] | <code>Array.&lt;Object&gt;</code> &#124; <code>undefined</code> | An array strings or     unicode codepoints (or both) that you want to keep in the output.  Leave     undefined to keep all glyphs (convert only). |
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
| [config.glyphs] | <code>Array.&lt;Object&gt;</code> &#124; <code>undefined</code> | An array strings or     unicode codepoints (or both) that you want to keep in the output.  Leave     undefined to keep all glyphs (convert only). |
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

***

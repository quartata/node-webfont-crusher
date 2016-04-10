const formats = require('./formats.js');

module.exports = {
  noConfigurationObject: 'config must be an object.',
  noRequiredArguments: 'You need to provide at least config.source and ' +
    'config.destination.',
  source: {
    notString: 'config.source must be a string.',
    notFile: 'config.source must be the path to a file.'
  },
  destination: {
    notString: 'config.destination must be a string.',
    notDirectory: 'Could not create directory config.destination.  File ' +
      'exists but is not a directory.',
    notWriteable: 'config.destination does not exist and could not be ' +
      'created. Please check that you have write permissions to the parent.'
  },
  glyphs: {
    notArray: 'If config.glyphs is not undefined it must be an Array',
    notNumberOrString: 'Legal types for items in config.glyphs are  "number" ' +
      'and "string"'
  },
  basename: {
    notString: 'If config.basename is not undefined it must be a string.'
  },
  formats: {
    notArray: 'If config.formats is not undefined it must be an Array',
    notString: 'Items in config.formats must be of type "string"',
    notValidFormat: `Valid formats are ${formats.join(', ')}.`
  },
  scss: {
    notString: 'If config.scss is not undefined it must be a string.',
    notWriteable: 'Parent directory of config.scss does not exist and could ' +
      'not be created. Please check that you have write permissions to the ' +
      'parent.'
  },
  callback: {
    notFunction: 'If config.callback is not undefined it must be a function.'
  }
};

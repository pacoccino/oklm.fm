'use strict';

const defaultConfig = require('../../config/config.json');

module.exports = Object.assign({}, defaultConfig, {
  'log': {
    'path': process.env.LOG_DIR || defaultConfig.log.path
  },
  'api': {
    'port': process.env.API_PORT || defaultConfig.api.port
  },
  'static': {
    'port': process.env.STATIC_PORT || defaultConfig.static.port,
    'publicFolder': process.env.PUBLIC_FOLDER || defaultConfig.static.publicFolder
  }
});

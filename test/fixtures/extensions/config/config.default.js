'use strict';

const path = require('path');

module.exports = {
  extraConfig: {
    paths: [
      path.join(__dirname, '../fixtures/js'),
      path.join(__dirname, '../fixtures/json'),
    ],
    extensions: [ '.js' ],
  },
};

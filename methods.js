
const fs = require('fs');

const logger = require('./logger.js');

const methods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'];

module.exports = {
  scan: function(input, callback) {

	var method = input.substring(0, input.indexOf(' '));
    if(methods.indexOf(method.toUpperCase()) === -1) {
      logger.info(`${method} is not a recognised http method`);
    }
    callback();
  },
  help: function() {
    return 'usage: hey there.... smileyface';
  }
};


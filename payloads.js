const fs = require('fs');

const logger = require('./logger.js');

const payloads = [
  { description: 'suspect payload', regex: 'bash' },
  { description: 'basic xss', regex: 'shodan' },
];

module.exports = {
  scan: function(input, callback) {

    logger.trace(input);

    payloads.forEach(function(payload) {
      var regex = new RegExp(payload.regex, 'i');

      if (regex.test(input)) {
        logger.info(`it could be ${payload.description}: ${input}`);
      }

    });

    callback();
  },
  help: function() {
    return 'usage: hey there.... smileyface';
  }
};
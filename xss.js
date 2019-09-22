const fs = require('fs');

const logger = require('./logger.js');

//https://github.com/PHPIDS/PHPIDS/blob/master/lib/IDS/default_filter.xml
//https://github.com/pgaijin66/XSS-Payloads/blob/master/payload.txt
//pull some stuff in from here
const words = [
  { description: 'basic xss', payload: 'script' },
  { description: 'basic xss', payload: 'javascript' },
  { description: 'basic xss', payload: 'svg' },
  { description: 'basic xss', payload: 'alert' },
  { description: 'basic xss', payload: 'onmouseover' },
  { description: 'basic xss', payload: 'iframe' },
  { description: 'basic xss', payload: 'prompt' },
  { description: 'basic xss', payload: 'confirm' },
];

module.exports = {
  scan: function(input, callback) {

    logger.trace(input);

    words.forEach(function(word) {
      var regex = new RegExp(word.payload, 'i');

      if (regex.test(input.toUpperCase())) {
        logger.info(`it could be ${word.description}: ${word.payload}`);
      }

    });

    callback();
  },
  help: function() {
    return 'usage: hey there.... smileyface';
  }
};
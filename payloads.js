const fs = require('fs');

const logger = require('./logger.js');

const payloads = [
  { description: 'suspect payload', regex: 'bash' },
  { description: 'basic xss', regex: 'shodan' },
  { description: 'suspect', regex: 'passwd' },
  { description: 'suspect', regex: 'password' },
];


//\x16\x03\x01
//is  the start of a TLS 1.0 handshake, i.e. content type (0x16 = handshake) 
//followed by TLS version (0x0301 = TLS 1.0). Looks like somebody tried to speak HTTPS on port 80 instead of 443.

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
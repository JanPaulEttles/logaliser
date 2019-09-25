const fs = require('fs');

const logger = require('./logger.js');

const words = [
  { description: 'basic sqli', payload: 'OR 1=1' },
  { description: 'basic sqli', payload: 'OR%201=1' },
  { description: 'basic sqli', payload: 'SELECT' },
  { description: 'basic sqli', payload: 'UNION' },
  { description: 'basic sqli', payload: 'FROM' },
  { description: 'basic sqli', payload: 'WHERE' },
  { description: 'basic sqli', payload: 'EXEC' },
  { description: 'basic sqli', payload: '@@version' },
  { description: 'basic sqli', payload: 'DB_NAME' },
];


var readline = require('readline');

var payloads = [];
var count = 0;

module.exports = {
  load: function(file, callback) {

    logger.trace(file);

    if (file === undefined) {
      file = 'sqli_payloads_rf_v0.1.txt';
    }
    var lineReader = readline.createInterface({
      input: fs.createReadStream(file)
    });

    lineReader.on('line', function(line) {
      logger.trace(line);
      count++;
      payloads.push(line);
    });
    lineReader.on('close', function(line) {
      logger.trace('done reading the file...');
      callback(null, count);
    });
  },
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
  scanDeep: function(input, callback) {

    try {

      logger.trace(input);

      payloads.forEach(function(payload) {
        if (input.includes(payload)) {
          logger.info(`it could be sqli : ${payload}`);
        }
        if (input.includes(encodeURIComponent(payload))) {
          logger.info(`it could be sqli : ${payload}`);
        }
      });
    } catch (error) {
      logger.error(error);
      callback(error);
    }

    callback();
  },
  help: function() {
    return 'usage: hey there.... smileyface';
  }
};
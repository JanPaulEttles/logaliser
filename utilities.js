const fs = require('fs');

var readline = require('readline');
const logger = require('./logger.js');

module.exports = {
  load: function(file, callback) {

    try {
      var count = 0;
      vad contents = [];

      logger.trace(file);
      var lineReader = readline.createInterface({
        input: fs.createReadStream(file)
      });

      lineReader.on('line', function(line) {
        logger.trace(line);
        count++;
        contents.push(line);
      });
      lineReader.on('close', function(line) {
        logger.trace(`done reading ${count} lines from the file...${file}`);
        callback(null, contents);
      });
    } catch (error) {
      logger.error(error);
      callback(error);
    }
  },
  scan: function(input, tests, callback) {

    try {

      logger.trace(input);
      var results = [];
      tests.forEach(function(test) {
        var regex = new RegExp(test, 'i');

        if(regex.test(input.toUpperCase())) {
          logger.trace(`it could be ${test}`);
          results.push(test);
        }

        if(regex.test(fixedEncodeURIComponent(input.toUpperCase()))) {
          logger.trace(`it could be ${test}`);
          results.push(test);
        }
      });

    } catch (error) {
      logger.error(error);
      callback(error);
    }
    callback(null, results);
  },
  help: function() {
    return 'usage: hey there.... smileyface';
  }
};

const fixedEncodeURIComponent = (str) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => {
    return '%' + c.charCodeAt(0).toString(16)
  })
}
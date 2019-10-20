const fs = require('fs');

const logger = require('./logger.js');

const map = new Map();


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

module.exports = {
  load: function(file, callback) {

    logger.trace(file);

    var count = 0;
    if(file === undefined) {
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
  scan: function(linenumber, input, callback) {
    try {
      logger.trace(input);
      var results = [];
      var findings = [];
      words.forEach(function(word) {
        var finding = {};
        var regex = new RegExp(word.payload, 'i');

        if(regex.test(input.toUpperCase())) {
          //logger.info(`it could be ${word.description}: ${word.payload}`);
          results.push(`it could be ${word.description}: ${word.payload}`);
          finding.payload = word.payload;
          finding.input = input;
          findings.push(finding);
        }
        if(regex.test(fixedEncodeURIComponent(input.toUpperCase()))) {
          //logger.info(`it could be ${word.description}: ${word.payload}`);
          results.push(`it could be ${word.description}: ${word.payload} URI encoded`);
          finding.payload = word.payload;
          finding.input = input;
          findings.push(finding);
        }
      });
      map.set(linenumber, findings);

    } catch (error) {
      logger.error(error);
      callback(error);
    }

    callback(null, results);
  },
  scanDeep: function(input, callback) {

    try {

      logger.trace(input);
      var results = [];

      payloads.forEach(function(payload) {
        if(input.includes(payload)) {
          //logger.info(`it could be sqli : ${payload}`);
          results.push(`it could be sqli : ${payload}`);
        }
        if(input.includes(fixedEncodeURIComponent(payload))) {
          //logger.info(`it could be sqli : ${payload}`);
          results.push(`it could be sqli : ${fixedEncodeURIComponent(payload)} URI encoded`);
        }
      });
    } catch (error) {
      logger.error(error);
      callback(error);
    }

    callback(null, results);
  },
  asJSON: function(callback) {
    logger.info(`sqli.asJSON`);

    try {
      var results = [];

      map.forEach(function(value, key) {
        var json = {
          linenumber: {},
          findings: []
        };

        json.linenumber = key;
        value.forEach(function(item, index) {
          var finding = {
            payload: {},
            input: {}
          }
          finding.payload = item.payload;
          finding.input = item.input;

          json.findings.push(finding);
        });
        if(json.findings.length !== 0) {
          results.push(json);
        }
      });
    } catch (error) {
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
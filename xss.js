const fs = require('fs');

const logger = require('./logger.js');

const map = new Map();


//https://github.com/PHPIDS/PHPIDS/blob/master/lib/IDS/default_filter.xml
//https://github.com/pgaijin66/XSS-Payloads/blob/master/payload.txt
//pull some stuff in from here
const words = [
  { description: 'basic xss', payload: '<script' },
  { description: 'basic xss', payload: 'javascript[:"]' },
  { description: 'basic xss', payload: 'svg' },
  { description: 'basic xss', payload: 'alert' },
  { description: 'basic xss', payload: 'onmouseover[ =>]' },
  { description: 'basic xss', payload: 'iframe' },
  { description: 'basic xss', payload: 'prompt' },
  { description: 'basic xss', payload: 'confirm' },
];

var readline = require('readline');

var payloads = [];

module.exports = {
  load: function(file, callback) {

    var count = 0;

    logger.trace(file);

    if(file === undefined) {
      file = 'xss_payloads_rf_v0.1.txt';
      //file = 'test_xss_payloads.txt';
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
  scanWithStatus: function(querystring, statuscode, callback) {

    try {

      logger.trace(input);
      var results = [];
      words.forEach(function(word) {
        var regex = new RegExp(word.payload, 'i');

        if(regex.test(input.toUpperCase())) {
          //logger.info(`it could be ${word.description}: ${word.payload}`);
          results.push(`it could be ${word.description}: ${word.payload}`);
        }
        if(regex.test(fixedEncodeURIComponent(input.toUpperCase()))) {
          //logger.info(`it could be ${word.description}: ${word.payload}`);
          results.push(`it could be ${word.description}: ${word.payload} URI encoded`);
        }
      });

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

      //escape() will not encode: @*/+
      //encodeURI() will not encode: ~!@#$&*()=:/,;?+'
      //encodeURIComponent() will not encode: ~!*()'


      payloads.forEach(function(payload) {
        //logger.info(input);
        //logger.info(payload);
        //logger.info(encodeURIComponent(payload));
        //logger.info(escape(payload));
        //logger.info(fixedEncodeURIComponent(payload));

        if(input.includes(payload)) {
          //logger.info(`it could be xss : ${payload}`);
          results.push(`it could be xss : ${payload}`);
        }
        if(input.includes(fixedEncodeURIComponent(payload))) {
          //logger.info(`it could be xss : ${payload}`);
          results.push(`it could be xss : ${fixedEncodeURIComponent(payload)} URI encoded`);
        }
      });
    } catch (error) {
      logger.error(error);
      callback(error);
    }

    callback(null, results);
  },
  asJSON: function(callback) {
    logger.info(`xss.asJSON`);

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
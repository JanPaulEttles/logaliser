const fs = require('fs');

const logger = require('./logger.js');
const utilities = require('./utilities.js');

const map = new Map();

const useragents = [
  { description: 'suspect useragent', regex: 'curl' },
  { description: 'suspect useragent', regex: 'bot' },
  { description: 'suspect useragent', regex: 'libwww-perl' },
];

module.exports = {
  scan: function(linenumber, input, callback) {
    try {
      logger.trace(input);
      var findings = [];
      var results = [];
      useragents.forEach(function(useragent) {
        var finding = {};
        var regex = new RegExp(useragent.regex, 'i');

        if(regex.test(input)) {
          //logger.info(`it could be ${useragent.description}: ${input}`);
          results.push(`it could be ${useragent.description}: ${input}`);
          finding.regex = useragent.regex;
          finding.input = input;
          findings.push(finding);
        }
      });
      if(!utilities.isEmpty(findings)) {
        map.set(linenumber, findings);
      }

    } catch (error) {
      logger.error(error);
      callback(error);
    }

    callback(null, results);
  },
  asJSON: function(callback) {
    logger.info(`useragents.asJSON`);

    var results = [];
    try {
      map.forEach(function(value, key) {
        var json = {
          linenumber: {},
          findings: []
        };

        json.linenumber = key;
        value.forEach(function(item, index) {
          var finding = {
            regex: {},
            input: {}
          }
          finding.regex = item.regex;
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
const fs = require('fs');

const logger = require('./logger.js');
const utilities = require('./utilities.js');

const map = new Map();

const mostcommonmethods = [
  'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT'
];


const commonmethods = [
  'OPTIONS', 'TRACE', 'PATCH', 'UPDATE'
];

const lessusedmethods = [
  'ACL', 'BASELINE-CONTROL', 'BIND', 'CHECKIN', 'CHECKOUT', 'COPY', 'LABEL', 'LINK',
  'LOCK', 'MERGE', 'MKACTIVITY', 'MKCALENDAR', 'MKCOL', 'MKREDIRECTREF', 'MKWORKSPACE',
  'MOVE', 'ORDERPATCH', 'PRI', 'PROPFIND', 'PROPPATCH', 'REBIND', 'REPORT', 'SEARCH',
  'UNBIND', 'UNCHECKOUT', 'UNLINK', 'UNLOCK', 'UPDATEREDIRECTREF', 'VERSION-CONTROL'
];

module.exports = {
  scan: function(linenumber, request, statuscode, callback) {

    try {
      var results = [];
      var findings = [];

      //strip the method out of the request string
      var method = request.substring(1, request.indexOf(' '));
      var finding = {};

      //logger.info(`${mostcommonmethods.indexOf(method.toUpperCase())} : ${method}`);

      if(mostcommonmethods.indexOf(method.toUpperCase()) === -1) {
        if(commonmethods.indexOf(method.toUpperCase()) === -1) {
          if(lessusedmethods.indexOf(method.toUpperCase()) === -1) {
            //logger.info(`${method} is not a recognised http method`);
            results.push(`${method} is not a known http method`);
            finding.method = method;
            finding.request = request;
            findings.push(finding);
          } else {
            //logger.info(`${method} is not a recognised http method`);
            results.push(`${method} is a very rarely used http method`);
            finding.method = method;
            finding.request = request;
            findings.push(finding);

          }
        } else {
          //logger.info(`${method} is a less used http method`);
          results.push(`${method} is a less used http method`);
          finding.method = method;
          finding.request = request;
          findings.push(finding);
        }
      }

      if(!isEmpty(findings)) {
        map.set(linenumber, findings);
      }
    } catch (error) {
      logger.error(error);
      callback(error);
    }

    callback(null, results);
  },
  asJSON: function(callback) {
    logger.info(`methods.asJSON`);

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
            method: {},
            request: {}
          }
          finding.method = item.method;
          finding.request = item.request;

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
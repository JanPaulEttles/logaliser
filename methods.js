const fs = require('fs');

const logger = require('./logger.js');
const map = new Map();


const methods = [
  'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH', 'UPDATE'
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

      //strip the method out of the request string
      var method = request.substring(0, request.indexOf(' '));
      var finding = {};
      if(methods.indexOf(method.toUpperCase()) === -1) {
        if(lessusedmethods.indexOf(method.toUpperCase()) === -1) {
          logger.info(`${method} is not a recognised http method`);
          finding.payload = word.payload;
          finding.input = input;
          findings.push(finding);
        } else {
          logger.info(`${method} is a less used http method`);
          finding.payload = word.payload;
          finding.input = input;
          findings.push(finding);
        }
      }
      map.set(linenumber, findings);

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

const fs = require('fs');

const logger = require('./logger.js');

const methods = [
					'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH', 'UPDATE'
				];

const lessusedmethods = [
							'ACL', 'BASELINE-CONTROL', 'BIND', 'CHECKIN', 'CHECKOUT', 'COPY','LABEL', 'LINK', 
							'LOCK', 'MERGE', 'MKACTIVITY', 'MKCALENDAR', 'MKCOL', 'MKREDIRECTREF', 'MKWORKSPACE', 
							'MOVE', 'ORDERPATCH', 'PRI', 'PROPFIND', 'PROPPATCH', 'REBIND', 'REPORT', 'SEARCH', 
							'UNBIND', 'UNCHECKOUT', 'UNLINK', 'UNLOCK', 'UPDATEREDIRECTREF', 'VERSION-CONTROL'
						];

module.exports = {
  scan: function(request, statuscode, callback) {

  	//strip the method out of the request string
	var method = request.substring(0, request.indexOf(' '));

    if(methods.indexOf(method.toUpperCase()) === -1) {
    	if(lessusedmethods.indexOf(method.toUpperCase()) === -1) {
      		logger.info(`${method} is not a recognised http method`);
      	}
      	else {
      		logger.info(`${method} is a less used http method`);	
      	}
    }
    callback();
  },
  help: function() {
    return 'usage: hey there.... smileyface';
  }
};


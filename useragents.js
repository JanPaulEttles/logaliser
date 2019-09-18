
const fs = require('fs');

const logger = require('./logger.js');

const useragents = [ 
                { description: 'suspect useragent', regex :'curl' },
                { description: 'suspect useragent', regex :'bot' }, 
                { description: 'suspect useragent', regex :'libwww-perl' }, 
              ];

module.exports = {
  scan: function(input, callback) {

    logger.trace(input);

    useragents.forEach(function(useragent) {
    	var regex = new RegExp(useragent.regex, 'i');	

	    if(regex.test(input)) {
	      logger.info(`it could be ${useragent.description}: ${input}`);
	    }

    });

    callback();
  },
  help: function() {
    return 'usage: hey there.... smileyface';
  }
};



const fs = require('fs');

const logger = require('./logger.js');

const words = [ 
                { description: 'basic sqli', payload :'OR 1=1' }, 
                { description: 'basic sqli', payload :'OR%201=1' }, 
                { description: 'basic sqli', payload :'SELECT' },                 
                { description: 'basic sqli', payload :'UNION' },                 
                { description: 'basic sqli', payload :'FROM' }, 
                { description: 'basic sqli', payload :'WHERE' },                 
                { description: 'basic sqli', payload :'EXEC' }, 
                { description: 'basic sqli', payload :'@@version' }, 
                { description: 'basic sqli', payload :'DB_NAME' },                 
              ];
module.exports = {
  scan: function(input, callback) {

    logger.trace(input);

    words.forEach(function(word) {
    	var regex = new RegExp(word.payload, 'i');	

	    if(regex.test(input.toUpperCase())) {
	      logger.info(`it could be ${word.description}: ${word.payload}`);
	    }

    });

    callback();
  },
  help: function() {
    return 'usage: hey there.... smileyface';
  }
};



const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const yargs = require('yargs');
const async = require('async');

const logger = require('./logger.js');



/*
*	Parse the arguements
*/
const argv = yargs
  	.usage('Iterate over a file of URLs and fetch information about them.\n\n')
	.version('version').alias('version', 'v')
  	.help('help').alias('help', 'h')
  	.options({
    	input: {
	      	alias: 'i',
   		   	description: "<filename> Input file name",
      		requiresArg: true,
		    required: true
    	}
	}).argv;


fs.createReadStream(argv.input)
    .pipe(csv.parse())
    .on('error', error => console.error(error))
    .on('data', row => process(row))
    .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));


function process(data) {

	var rr = {
		servername: {},
	    request: {
	      http: {
	      	url: {}
	      },
	      https: {
	      	url: {}
	      }
	    },
	    response: {
	      http: {
	        response: {},
	        body: {}
	      },
	      https: {
	      	certificate: {
	      		subjectAlternateName: {},
	      		validity: {
	      			from: {},
	      			to: {}
	      		}
	      	},
	      	tls: {
	      		tsl1Enabled: {},
	      		tsl1_1Enabled: {},
	      		tsl1_2Enabled: {},
	      		tsl1_3Enabled: {}
	      	},
	        response: {},
	        body: {}
	      }
	    }
	};

	rr.servername = data[1];
	rr.request.http.url = 'http://' + data[1];
	rr.request.https.url = 'https://' + data[1];

	async.series([
	    function(callback) {
			logger.trace('** process url http: ' + rr.request.http.url);
    		request.get(rr.request.http.url, function(err, response, body) {
        		if (err) { logger.error('** request.get: error >> ' + err); return callback(err); }        		

				rr.response.https.response = response;
        		rr.response.http.body = body;
        		callback();
      		});
    	},	    	
    	function(callback) {
      		logger.trace('** something else');
	        callback();
      	}      	
	],
	function(err, results) {
		logger.info(rr.servername);
		//console.log(rr.response.http.headers);
		logger.info(rr.response.https.tls.tsl1Enabled);
		logger.info(rr.response.https.tls.tsl1_1Enabled);
		logger.info(rr.response.https.tls.tsl1_2Enabled);
		logger.info(rr.response.https.tls.tsl1_3Enabled);
		
	});	
}












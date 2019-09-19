
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const yargs = require('yargs');
const async = require('async');

const logger = require('./logger.js');
const headers = require('./headers.js');

const creditcards = require('./creditcards.js');
const methods = require('./methods.js');
const sqli = require('./sqli.js');
const xss = require('./xss.js');
const statuscodes = require('./statuscodes.js');
const useragents = require('./useragents.js');
const payloads = require('./payloads.js');

/*
	var rr = {
		servername: {},
	    request: {
	      http: {
	      	url: {}
	      }
	    }
	};
*/

/*
*	Parse the arguements
*/
const argv = yargs
  	.usage('Iterate over a web access file and look for security stuff.\n\n')
	.version('version').alias('version', 'v')
  	.help('help').alias('help', 'h')
  	.options({
    	input: {
	      	alias: 'i',
   		   	description: "<filename> Log file name",
      		requiresArg: true,
		    required: true
    	},
    	config: {
	      	alias: 'c',
   		   	description: "<filename> Config file name",
      		requiresArg: true,
		    required: true
    	},
    	creditcards: {
      		description: 'Scan for creditcards in the requests',
      		boolean: true,
      		alias: 'cc'
    	},
    	methods: {
      		description: 'Scan for incorrect methods in the requests',
      		boolean: true,
      		alias: 'm'
    	}   	
	}).argv;

logger.info(argv.cc);
logger.info(argv.m);

headers.load(argv.config, function(err, result) {
	if (err) { logger.error(`** request.get: error >> ${err}`); }   		
	parseLog();
});

function parseLog() {
	fs.createReadStream(argv.input)
	    .pipe(csv.parse({ delimiter: '\t' }))
	    .on('error', error => logger.error(error))
	    .on('data', row => process(row))
	    .on('end', rowCount => complete(rowCount));
}

function complete(rowCount) {

	logger.trace(`Parsed ${rowCount} rows`)

	statuscodes.results(function(result) {	

	});
}

function process(data) {
	//logger.info(`data[0] : ${data[0]}`);
	//logger.info(headers.getPosition(headers.REQUEST));
	async.series([	
	    function(callback) {
			logger.trace(`** process request: `);
       		//if (err) { logger.error(`** request.get: error >> ${err}); return callback(err); }
       		logger.trace(`headers.getPosition(headers.REQUEST) ${headers.getPosition(headers.REQUEST)}`);
       		logger.trace(`headers.getPosition(headers.STATUSCODE) ${headers.getPosition(headers.STATUSCODE)}`);

       		creditcards.scan(
       			data[headers.getPosition(headers.REQUEST)], 
       			data[headers.getPosition(headers.STATUSCODE)],
       			function(result) {
       				//do something with the result
       		});
       		callback();
    	},
	    function(callback) {
			logger.trace(`** check http methods: `);
       		//if (err) { logger.error(`** request.get: error >> ${err}); return callback(err); }
       		logger.trace(`headers.getPosition(headers.REQUEST) ${headers.getPosition(headers.REQUEST)}`);
       		methods.scan(
       			data[headers.getPosition(headers.REQUEST)], 
       			function(result) {
       		
       		});
       		callback();
    	},
    	function(callback) {
			logger.trace(`** check sqli: `);
       		//if (err) { logger.error(`** request.get: error >> ${err}); return callback(err); }
			logger.trace(`headers.getPosition(headers.REQUEST) ${headers.getPosition(headers.REQUEST)}`);
       		sqli.scan(
       			data[headers.getPosition(headers.REQUEST)], 
       			function(result) {

       		});
       		callback();
    	},
    	function(callback) {
			logger.trace(`** check xss: `);
       		//if (err) { logger.error(`** request.get: error >> ${err}); return callback(err); }
       		logger.trace(`headers.getPosition(headers.REQUEST) ${headers.getPosition(headers.REQUEST)}`);
       		xss.scan(
       			data[headers.getPosition(headers.REQUEST)], 
       			function(result) {

       		});
       		callback();
    	},    	
    	function(callback) {
			logger.trace(`** check status codes: `);
       		//if (err) { logger.error(`** request.get: error >> ${err}); return callback(err); }
       		logger.trace(`headers.getPosition(headers.SOURCE) ${headers.getPosition(headers.SOURCE)}`);
       		logger.trace(`headers.getPosition(headers.STATUSCODE) ${headers.getPosition(headers.STATUSCODE)}`);
       		statuscodes.scan(
       			data[headers.getPosition(headers.SOURCE)], 
       			data[headers.getPosition(headers.STATUSCODE)], 
       			function(result) {

       		});
       		callback();
    	},
		function(callback) {
			logger.trace(`** check useragents: `);
       		//if (err) { logger.error(`** request.get: error >> ${err}); return callback(err); }
       		logger.trace(`headers.getPosition(headers.USERAGENT) ${headers.getPosition(headers.USERAGENT)}`);
       		useragents.scan(
       			data[headers.getPosition(headers.USERAGENT)], 
       			function(result) {

       		});
       		callback();
    	},
		function(callback) {
			logger.trace(`** check payloads: `);
       		//if (err) { logger.error(`** request.get: error >> ${err}); return callback(err); }
       		logger.trace(`headers.getPosition(headers.REQUEST) ${headers.getPosition(headers.REQUEST)}`);
       		payloads.scan(
       			data[headers.getPosition(headers.REQUEST)], 
       			function(result) {

       		});
       		callback();
    	},    	
    	function(callback) {
      		logger.trace(`** something else`);
	        callback();
      	}      	
	],
	function(err, results) {

		logger.trace(`done`);
	});	
}
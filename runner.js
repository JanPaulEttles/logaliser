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
		all: {
			description: 'Scan using all the modules',
			boolean: true,
			default: false,
			alias: 'all'
		},
		creditcards: {
			description: 'Scan for creditcards in the requests',
			boolean: true,
			default: false,
			alias: 'cards'
		},
		methods: {
			description: 'Scan for incorrect methods in the requests',
			boolean: true,
			default: false,
			alias: 'methods'
		},
		xss: {
			description: 'Scan for xss in the requests',
			boolean: true,
			default: false,
			alias: 'xss'
		},
		xssdeep: {
			description: 'Deep scan for xss in the requests',
			boolean: true,
			default: false,
			alias: 'xssdeep'
		},
		sqlipayloads: {
			alias: 'xsspayloads',
			description: "<filename> Log file name",
			requiresArg: true,
			required: false
		},
		sqli: {
			description: 'Scan for sqli in the requests',
			boolean: true,
			default: false,
			alias: 'sqli'
		},
		sqlideep: {
			description: 'Deep scan for sqli in the requests',
			boolean: true,
			default: false,
			alias: 'sqlideep'
		},
		sqlipayloads: {
			alias: 'sqlipayloads',
			description: "<filename> Log file name",
			requiresArg: true,
			required: false
		},
		statuscodes: {
			description: 'Scan for statuscodes against sources',
			boolean: true,
			default: false,
			alias: 'statuscodes'
		},
		useragents: {
			description: 'Scan for odd useragents',
			boolean: true,
			default: false,
			alias: 'useragents'
		},
		payloads: {
			description: 'Scan for suspicious payloads',
			boolean: true,
			default: false,
			alias: 'payloads'
		}
	}).argv;

init();

function init() {
	if (!argv.all) {
		if (!argv.creditcards) {
			logger.info(`** skipping checks for credit cards: `);
		}
		if (!argv.methods) {
			logger.info(`** skipping checks for dodgy methods: `);
		}
		if (!argv.xss) {
			logger.info(`** skipping checks for xss: `);
		}
		if (!argv.xssdeep) {
			logger.info(`** skipping deep checks for xss: `);
		} else {
			logger.info(`** loading search terms for deep xss: `);
			xss.load(
				argv.xsspayloads,
				function(error, count) {
					if (error) { logger.error(`** xss.load: error >> ${error}`); }
					logger.info(`** loaded ${count} search terms for xss`);
				});
		}
		if (!argv.sqli) {
			logger.info(`** skipping checks for sqli: `);
		}
		if (!argv.sqlideep) {
			logger.info(`** skipping deep checks for sqli: `);
		} else {
			logger.info(`** loading search terms for deep sqli: `);
			sqli.load(
				argv.sqlipayloads,
				function(error, count) {
					if (error) { logger.error(`** sqli.load: error >> ${error}`); }
					logger.info(`** loaded ${count} search terms for sqli`);
				});
		}
		if (!argv.statuscodes) {
			logger.info(`** skipping checks for statuscodes: `);
		}
		if (!argv.useragents) {
			logger.info(`** skipping checks for useragents: `);
		}
		if (!argv.payloads) {
			logger.info(`** skipping checks for dodgy payloads: `);
		}
	}
	headers.load(argv.config, function(error, result) {
		if (error) { logger.error(`** request.get: error >> ${error}`); }
		parseLog();
	});

}



function parseLog() {
	var linenumber = 1;
	try {
		fs.createReadStream(argv.input)
			.pipe(csv.parse({ quote: null, delimiter: '\t' }))
			.on('error', error => logger.error(error))
			.on('data', function(row) {
				process(linenumber++, row);
			})
			.on('end', rowCount => complete(rowCount));
	} catch (error) {
		logger.error("logaliser: " + error);
	}
}


function complete(rowCount) {

	logger.trace(`Parsed ${rowCount} rows`)

	statuscodes.results(function(result) {

	});

}

function process(linenumber, data) {
	if (data.length !== headers.getHeaderSize()) {
		logger.warn(`data.length ${data.length} but headers.getHeaderSize is ${headers.getHeaderSize()}`);
	} else {
		async.series([
				function(callback) {
					if (argv.all || argv.creditcards) {
						logger.trace(`** check for credit cards: `);
						logger.trace(`headers.getPosition(headers.REQUEST) ${headers.getPosition(headers.REQUEST)}`);

						creditcards.scanWithConfidence(
							data[headers.getPosition(headers.REQUEST)],
							function(error, results) {
								if (error) { logger.error(`** creditcards.scanWithConfidence: error >> ${error}`); return callback(error); }
								results.forEach(function(result) {
									logger.info(`line ${linenumber} : ${result}`);
								});
							});
					}
					callback();
				},
				function(callback) {
					if (argv.all || argv.methods) {
						logger.trace(`** check http methods: `);
						logger.trace(`headers.getPosition(headers.REQUEST) ${headers.getPosition(headers.REQUEST)}`);
						logger.trace(`headers.getPosition(headers.STATUSCODE) ${headers.getPosition(headers.STATUSCODE)}`);

						methods.scan(
							data[headers.getPosition(headers.REQUEST)],
							data[headers.getPosition(headers.STATUSCODE)],
							function(error, results) {
								if (error) { logger.error(`** methods.scanWithConfidence: error >> ${error}`); return callback(error); }
								results.forEach(function(result) {
									logger.info(`line ${linenumber} : ${result}`);
								});
							});
					}
					callback();
				},
				function(callback) {
					if (argv.all || argv.sqli) {
						logger.trace(`** check sqli: `);
						logger.trace(`headers.getPosition(headers.REQUEST) ${headers.getPosition(headers.REQUEST)}`);
						sqli.scan(
							data[headers.getPosition(headers.REQUEST)],
							function(error, results) {
								if (error) { logger.error(`** sqli.scan: error >> ${error}`); return callback(error); }
								results.forEach(function(result) {
									logger.info(`line ${linenumber} : ${result}`);
								});
							});
					}
					callback();
				},
				function(callback) {
					if (argv.all || argv.sqlideep) {
						logger.trace(`** check sqlideep: `);
						logger.trace(`headers.getPosition(headers.REQUEST) ${headers.getPosition(headers.REQUEST)}`);
						sqli.scanDeep(
							data[headers.getPosition(headers.REQUEST)],
							function(error, results) {
								if (error) { logger.error(`** sqli.scanDeep: error >> ${error}`); return callback(error); }
								results.forEach(function(result) {
									logger.info(`line ${linenumber} : ${result}`);
								});
							});
					}
					callback();
				},
				function(callback) {
					if (argv.all || argv.xssdeep) {
						logger.trace(`** check xssdeep: `);
						logger.trace(`headers.getPosition(headers.REQUEST) ${headers.getPosition(headers.REQUEST)}`);
						xss.scanDeep(
							data[headers.getPosition(headers.REQUEST)],
							function(error, results) {
								if (error) { logger.error(`** xss.scanDeep: error >> ${error}`); return callback(error); }
								results.forEach(function(result) {
									logger.info(`line ${linenumber} : ${result}`);
								});
							});
					}
					callback();
				},
				function(callback) {
					if (argv.all || argv.xss) {
						logger.trace(`** check xss: `);
						logger.trace(`headers.getPosition(headers.REQUEST) ${headers.getPosition(headers.REQUEST)}`);
						xss.scan(
							data[headers.getPosition(headers.REQUEST)],
							function(error, results) {
								if (error) { logger.error(`** xss.scan: error >> ${error}`); return callback(error); }
								results.forEach(function(result) {
									logger.info(`line ${linenumber} : ${result}`);
								});
							});
					}
					callback();
				},
				function(callback) {
					if (argv.all || argv.statuscodes) {
						logger.trace(`** check status codes: `);
						logger.trace(`headers.getPosition(headers.SOURCE) ${headers.getPosition(headers.SOURCE)}`);
						logger.trace(`headers.getPosition(headers.STATUSCODE) ${headers.getPosition(headers.STATUSCODE)}`);
						statuscodes.scan(
							data[headers.getPosition(headers.SOURCE)],
							data[headers.getPosition(headers.STATUSCODE)],
							function(error, results) {
								if (error) { logger.error(`** statuscodes.scan: error >> ${error}`); return callback(error); }
							});
					}
					callback();
				},
				function(callback) {
					if (argv.all || argv.useragents) {
						logger.trace(`** check useragents: `);
						logger.trace(`headers.getPosition(headers.USERAGENT) ${headers.getPosition(headers.USERAGENT)}`);
						useragents.scan(
							data[headers.getPosition(headers.USERAGENT)],
							function(error, results) {
								if (error) { logger.error(`** useragents.scan: error >> ${error}`); return callback(error); }
							});
					}
					callback();
				},
				function(callback) {
					if (argv.all || argv.payloads) {
						logger.trace(`** check payloads: `);
						logger.trace(`headers.getPosition(headers.REQUEST) ${headers.getPosition(headers.REQUEST)}`);
						payloads.scan(
							data[headers.getPosition(headers.REQUEST)],
							function(error, results) {
								if (error) { logger.error(`** payloads.scan: error >> ${error}`); return callback(error); }
							});
					}
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
}
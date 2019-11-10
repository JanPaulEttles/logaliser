const moment = require('moment');

const fs = require('fs');


const dateformat = /\d{2}\/[a-zA-Z]{3}\/\d{4}:\d{2}:\d{2}:\d{2}/g;


var readline = require('readline');

var content = '';

const file = './data/test.log';


var lineReader = readline.createInterface({
	input: fs.createReadStream(file)
});

lineReader.on('line', function(line) {
	const newtime = moment(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))).format('DD/MMM/YYYY:hh:mm:ss');

	line = line.replace(dateformat, newtime);
	console.log(line);
	content += line + '\n';

});
lineReader.on('close', function(line) {


	fs.writeFile('./data/test_test.log', content, function(err) {
		if(err) throw err;
		console.log('Saved!');
	});

});
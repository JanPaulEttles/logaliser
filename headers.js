
const fs = require('fs');

const csv = require('fast-csv');
const logger = require('./logger.js');

const headers = [];

const REQUEST = 'request';
const SOURCE = 'source';
const STATUSCODE = 'statuscode';
const USERAGENT = 'useragent';
const TIMESTAMP = 'timestamp';

function complete(rowCount, callback) {
    logger.trace(`Parsed ${rowCount} rows`);
    callback(null, rowCount);
}

function process(row) {
  logger.trace(`Line from file: ${row[2]}`);

  var data = {
    position: {},
    type: {},
    name: {},
    description: {},
    example: {}
  };

  data.position = row[0];  
  data.type = row[1];
  data.name = row[2];  
  data.description = row[3];
  data.example = row[4];

  headers.push(data);
}

module.exports = {
  REQUEST: REQUEST,
  SOURCE: SOURCE,
  STATUSCODE: STATUSCODE,
  USERAGENT: USERAGENT,
  TIMESTAMP: TIMESTAMP,
  load: function(file, callback) {
    //clear the array
    headers.length = 0;
    fs.createReadStream(file)
        .pipe(csv.parse())
        .on('error', error => callback(error))
        .on('data', row => process(row))
        .on('end', rowCount => complete(rowCount, callback));    
  },
  getPosition: function(key) {
    var response = null;

    var found = headers.find(function(header) {
      return header.type === key;
    });

    logger.trace(`headers: position: ${key}`);
    logger.trace(`headers: position: ${found.position}`);
    return found.position;
  },
  help: function() {
    return 'usage: hey there.... smileyface';
  }
};


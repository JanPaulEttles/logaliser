
const fs = require('fs');
var midget = require('./midget.js');

const logger = require('./logger.js');

const map = new Map();

module.exports = {
  scan: function(source, status, callback) {

    logger.trace(`${source}, ${status}`);

    var count = 0;
    if(map.get(`${source}:${status}`) !== undefined) {
      count = map.get(`${source}:${status}`);
    }
    map.set(`${source}:${status}`, ++count);

    logger.trace(`${source}:${status}:${count}`);

    callback();
  },
  results: function(callback) {
   
    logger.info(`********************************************`);
    logger.info(`****************IP ANALYSIS*****************`); 
    logger.info(`********************************************`);
    map.forEach(function(value, key) {
      var values = key.split(':');
      logger.info(`${values[0]} \t ${values[1]} \t ${value}`);
    });
    callback();
  },  
  help: function() {
    return 'usage: hey there.... smileyface';
  }
};

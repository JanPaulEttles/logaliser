const fs = require('fs');

const logger = require('./logger.js');

const map = new Map();

module.exports = {
    scan: function(source, callback) {

        logger.trace(`${source}`);

        var count = 0;
        if(map.get(`${source}`) !== undefined) {
            count = map.get(`${source}`);
        }
        map.set(`${source}`, ++count);

        logger.trace(`${source}:${count}`);

        callback();
    },
    topAggressors: function(count, callback) {
        logger.info(`****************IP ANALYSIS*****************`);

        let mapAsc = new Map([...map].sort(([k, v], [k2, v2]) => {
            if(v < v2) { return 1; }
            if(v > v2) { return -1; }
            return 0;
        }));

        var counter = 0;


        for(const [key, value] of mapAsc.entries()) {
            counter++;
            logger.info(`${key} \t ${value}`);
            if(counter > count) {
                break;
            }

        }
        /*
                mapAsc.forEach(function(value, key) {
                    counter++;
                    logger.info(`${key} \t ${value}`);
                    if(counter > count) {
                        break;
                    }
                });
        */
        callback();
    },
    scanWithStatus: function(source, status, callback) {

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
    resultsAsJSON: function(callback) {

        var results = [];

        map.forEach(function(value, key) {
            var json = {
                source: {},
                statuscode: {},
                count: {}
            };

            var values = key.split(':');
            logger.trace(`${values[0]} \t ${values[1]} \t ${value}`);

            json.source = values[0];
            json.statuscode = values[1];
            json.count = values;
            results.push(json);
        });
        callback();
    },
    help: function() {
        return 'usage: hey there.... smileyface';
    }
};
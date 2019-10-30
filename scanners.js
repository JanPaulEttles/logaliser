const fs = require('fs');

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

        map.forEach(function(value, key) {
            var values = key.split(':');
            logger.info(`${values[0]} \t ${values[1]} \t ${value}`);
        });
        callback();
    },
    asJSON: function(callback) {
        try {
            var results = [];

            let mapAsc = new Map([...map].sort(([k, v], [k2, v2]) => {
                if(v < v2) { return 1; }
                if(v > v2) { return -1; }
                return 0;
            }));

            mapAsc.forEach(function(value, key) {
                var json = {
                    source: {},
                    statuscode: {},
                    count: {}
                };

                var values = key.split(':');
                logger.trace(`${values[0]} \t ${values[1]} \t ${value}`);

                json.source = values[0];
                json.statuscode = values[1];
                json.count = value;
                results.push(json);
            });
        } catch (error) {
            callback(error);
        }
        callback(null, results);
    },
    help: function() {
        return 'usage: hey there.... smileyface';
    }
};
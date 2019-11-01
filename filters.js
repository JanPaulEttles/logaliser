const fs = require('fs');

const logger = require('./logger.js');

const map = new Map();


//node runner.js -i data/test.log -c data/test.headers --test --f --fs 15.12.12.12 --fs 16.12.12.12 --fo jan
module.exports = {
    scan: function(source, timestamp, status, callback) {
        try {
            logger.info(`${source}, ${timestamp}, ${status}`);

            if(map.get(source) === undefined) {
                var entries = [];
                var entry = {};
                entry.status = status;
                entry.timestamp = timestamp;

                entries.push(entry);
                map.set(source, entries);
            } else {
                var entries = map.get(source);
                var entry = {};
                entry.status = status;
                entry.timestamp = timestamp;
                entries.push(entry);

            }

        } catch (error) {
            callback(error);
        }
        callback();
    },
    asJSON: function(callback) {
        try {
            var results = [];

            map.forEach(function(value, key) {
                var json = {
                    source: {},
                    entries: []
                };

                json.source = key;
                value.forEach(function(item, index) {
                    var entry = {
                        status: {},
                        timestamp: {}
                    }
                    entry.status = item.status;
                    entry.timestamp = item.timestamp;

                    json.entries.push(entry);
                });
                if(json.entries.length !== 0) {
                    results.push(json);
                }
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
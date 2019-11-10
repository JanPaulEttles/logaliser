const fs = require('fs');

const logger = require('./logger.js');

const map = new Map();


//node runner.js -i data/test.log -c data/test.headers --test --f --fs 15.12.12.12 --fs 16.12.12.12 --fo jan
const dateformat = /\d{2}\/[a-zA-Z]{3}\/\d{4}:\d{2}:\d{2}:\d{2}/g;

module.exports = {
    scan: function(source, timestamp, status, callback) {
        try {
            logger.trace(`${source}, ${timestamp}, ${status}`);

            logger.info(timestamp.match(dateformat));
            timestamp = timestamp.match(dateformat)[0].replace(":", ' ');
            ////logger.info(regex.exec(timestamp));
            //logger.info(JSON.stringify(timestamp.match(dateformat), null, 2));
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
                        timestamp: {},
                        status: {}

                    }

                    entry.timestamp = item.timestamp;
                    entry.status = item.status;

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
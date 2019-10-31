const fs = require('fs');

const logger = require('./logger.js');

const map = new Map();

module.exports = {
    scan: function(source, status, callback) {
        try {
            logger.trace(`${source}, ${status}`);

            if(map.get(source) === undefined) {
                var statii = [];
                var entry = {};
                entry.status = status;
                entry.count = 1;


                statii.push(entry);
                map.set(source, statii);
            } else {
                var statii = map.get(source);

                if(statii.filter(e => e.status === status).length > 0) {
                    var entry = statii.find(e => e.status === status);
                    entry.count = entry.count + 1;
                } else {
                    var entry = {};
                    entry.status = status;
                    entry.count = 1;
                    statii.push(entry);
                }
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
                    statii: [],
                    total: {}
                };

                json.source = key;
                json.total = 0;
                value.forEach(function(item, index) {
                    var entry = {
                        status: {},
                        count: {}
                    }
                    entry.status = item.status;
                    entry.count = item.count;
                    json.total = json.total + item.count;

                    json.statii.push(entry);
                });
                if(json.statii.length !== 0) {
                    results.push(json);
                }
            });
            results.sort((a, b) => (b.total > a.total) ? 1 : -1)
        } catch (error) {
            callback(error);
        }
        callback(null, results);
    },
    help: function() {
        return 'usage: hey there.... smileyface';
    }
};
const logger = require('./logger.js');

module.exports = {
  checkForCreditCard: function(input, callback) {
    logger.trace(`checkForCreditCard: ${input}`);


    if(err) { logger.error(`get: error >> ${err}`); return callback(err); }


	callback(null, ???);
  });
}
const fs = require('fs');

const logger = require('./logger.js');


//Visa: ^4[0-9]{12}(?:[0-9]{3})?$ All Visa card numbers start with a 4. New cards have 16 digits. Old cards have 13.
const cards = [
  { type: 'visa', regex: '4[0-9]{12}(?:[0-9]{3})?' },
  { type: 'master', regex: '(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))' },
  { type: 'maestro', regex: '(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}' }
];

module.exports = {
  scan: function(input, callback) {

    logger.trace(input);

    var clean = input.replace(/%20|[-+()\s]/g, '');

    cards.forEach(function(card) {
      var regex = new RegExp(card.regex, 'i');
      if (regex.test(clean)) {
        logger.info(`it could be a ${card.type}: ${regex.exec(clean)[0]}`);
      }

    });
    callback();
  },
  help: function() {
    return 'usage: hey there.... smileyface';
  }
};

//useful urls
//https://www.regular-expressions.info/creditcard.html
//https://stackoverflow.com/questions/9315647/regex-credit-card-number-tests
//http://support.worldpay.com/support/kb/bg/testandgolive/tgl5103.html
//https://www.getcreditcardinfo.com/generatevisacreditcard.php
//https://regex101.com/
const fs = require('fs');

const logger = require('./logger.js');


//Visa: ^4[0-9]{12}(?:[0-9]{3})?$ All Visa card numbers start with a 4. New cards have 16 digits. Old cards have 13.
const cards = [
  { type: 'visa', number: '4[0-9]{12}(?:[0-9]{3})?' },
  { type: 'master', number: '(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))' },
  { type: 'maestro', number: '(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}' }
];

module.exports = {
  scan: function(input, callback) {
    logger.trace(input);

    var clean = input.replace(/%20|[-+()\s]/g, '');

    cards.forEach(function(card) {
      var number = new RegExp(card.number, 'i');
      if (number.test(clean)) {
        logger.info(`it could be a ${card.type}: ${number.exec(clean)[0]}`);
      }
    });
    callback();
  },
  scanWithConfidence: function(input, callback) {
    logger.trace(input);

    var results = [];

    var clean = input.substring(input.indexOf(' ') + 1, input.length);
    var clean = clean.substring(0, clean.lastIndexOf(' '));
    var clean = clean.replace(/%20|[-+()\s]/g, '');

    cards.forEach(function(card) {
      var checks = Object.keys(card).length;
      var score = 0;

      for (var property in card) {
        if (check(clean, card[property])) { score++; }
      }
      if (score !== 0) {
        var confidence = score * 100 / checks;

        logger.debug(`${confidence}% confident it could be a ${card.type}: ${clean}`);

        var summary = `After ${score} check there is ${confidence}% confidence rating that it could be a ${card.type}: ${clean}`;

        results.push(summary);
      }
    });
    callback(null, results);
  },
  help: function() {
    return 'usage: hey there.... smileyface';
  }
};

function check(searchString, searchTerm) {
  var regex = new RegExp(searchTerm, 'i');
  return regex.test(searchString);
}
//useful urls
//https://www.regular-expressions.info/creditcard.html
//https://stackoverflow.com/questions/9315647/regex-credit-card-number-tests
//http://support.worldpay.com/support/kb/bg/testandgolive/tgl5103.html
//https://www.getcreditcardinfo.com/generatevisacreditcard.php
//https://regex101.com/
'use strict';

var utils = require('../utils/writer.js');
var MeetTransactions = require('../service/MeetTransactionsService');

module.exports.findPetsByStatus = function findPetsByStatus (req, res, next, status) {
  MeetTransactions.findPetsByStatus(status)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

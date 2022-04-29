'use strict';

var utils = require('../utils/writer.js');
var MeetAuthentications = require('../service/MeetAuthenticationsService');

module.exports.getAuthAccess = function getAuthAccess (req, res, next, api_key, version, category, username, password) {
  MeetAuthentications.getAuthAccess(api_key, version, category, username, password)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

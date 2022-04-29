'use strict';

var utils = require('../utils/writer.js');
var MeetUsers = require('../service/MeetUsersService');

module.exports.addUser = function addUser (req, res, next, body, type, category, api_key) {
  body.type = type[0];
  body.category = category[0];
  body.api_key = api_key;
  MeetUsers.addUser(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUsers = function getUsers (req, res, next, api_key, version, type, category, paging, i) {
  MeetUsers.getUsers(api_key, version, type, category, paging, i)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updatePet = function updatePet (req, res, next, body, version, paging, i, api_key) {
  MeetUsers.updatePet(body, version, paging, i, api_key)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

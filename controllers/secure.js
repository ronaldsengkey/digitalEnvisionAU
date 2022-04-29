'use strict';

var utils = require('../utils/writer.js');
var MeetUsers = require('../service/MeetUsersService');
let secure = require('../middleware/security');

module.exports.securing = function securing (req, res, next, body, type, category, api_key) {
  body.type = type[0];
  body.category = category[0];
  body.api_key = api_key;
  secure.generateRSA().then(async function (response){
    utils.writeJson(res, response);
  })
  MeetUsers.addUser(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

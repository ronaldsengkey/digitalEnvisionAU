'use strict';

var utils = require('../utils/writer.js');
var notif = require('../service/NotifService');


module.exports.getNotif = function getNotif(req, res, next, body) {
  body = {};
  let bearerToken = req.headers['authorization'].split(/\s/);
  body.token = bearerToken;
  body.apiKey = req.headers['x-api-key'];
  notif.getNotif(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
}

module.exports.createNotif = function createNotif(req, res, next, body) {
  let bearerToken = req.headers['authorization'].split(/\s/);
  body.token = bearerToken;
  body.apiKey = req.headers['x-api-key'];
  console.log(body);
  notif.createNotif(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
}







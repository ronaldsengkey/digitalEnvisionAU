'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');


module.exports.jobDetail = function jobDetail(req, res, next, body) {
  let bearerToken = req.headers['authorization'].split(/\s/);
  body = {};
  body.jobId = req.openapi.pathParams.id;
  body.apiKey = req.headers['x-api-key'];
  body.token = bearerToken;
  User.jobDetail(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
}

module.exports.home = function home(req, res, next, body) {
  body = {};
  let bearerToken = req.headers['authorization'].split(/\s/);
  if(req.query['description'] == ''){
    body.description = 'empty';
  }else{
    body.description = req.query['description']
  }
  if(req.query['location'] == ''){
    body.location = 'empty';
  }else{
    body.location = req.query['location']
  }
    body.apiKey = req.headers['x-api-key'];
  body.token = bearerToken;
  User.home(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
}


module.exports.getUser = function getUser(req, res, next, body) {
  let bearerToken = req.headers['authorization'].split(/\s/);
  body = {};
  if(req.query['id'] !== undefined){
    body.jobId = req.query['id'];
  }
  body.type = req.query['type'];
  body.category = req.query['category'];
  body.apiKey = req.headers['x-api-key'];
  body.token = bearerToken;

  if (body.type == "personal" && body.category == "customer") {
    var notif = {
      "responseCode": 601,
      "message": "Unaccepted request !"
    };
    utils.writeJson(res, notif);
  } else {
    User.getUser(body)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  }
}


module.exports.createUser = function createUser(req, res, next, body) {
  let apiKey = req.headers['x-api-key'],
    data = req.body;
  data.type = req.query['type'],
    data.category = req.query['category'],
    data.apiKey = apiKey;
  if (data.category == "customer" && data.role == "admin") {
    var notif = {
      "responseCode": 601,
      "message": "Unaccepted request !"
    };
    utils.writeJson(res, notif);
  } else if (data.category == "employee" && data.role == "") {
    var notif = {
      "responseCode": 601,
      "message": "Unaccepted request !"
    };
    utils.writeJson(res, notif);
  }else if(data.category == "customer" && data.role == ""){
    var notif = {
      "responseCode": 601,
      "message": "Unaccepted request !"
    };
    utils.writeJson(res, notif);
  } else {
    User.createUser(data)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
  }
};


module.exports.updateUser = function updateUser(req, res, next, body) {
  let bearerToken = req.headers['authorization'].split(/\s/);
  body.apiKey = req.headers['x-api-key'];
  body.type = req.query['type'];
  body.category = req.query['category'];
  body.token = bearerToken;
  if(req.query['id'] !== undefined){
    body.id = req.query['id']
  }
  User.updateUser(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};



module.exports.userLogin = function userLogin(req, res, next, body) {
  let basicAuth = req.headers['authorization'].split(/\s/),
    cr = new Buffer.from(basicAuth[1], 'base64').toString('ascii').split(':'),
    credential = {
      "phone": cr[0],
      "pin": cr[1]
    },
    data = {
      "accessKey": req.headers['x-api-key'],
      "credential": credential,
      "type": req.query['type'],
      "category": req.query['category']
    };

  User.userLogin(data)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};







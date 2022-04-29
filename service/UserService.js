'use strict';
// const {
//   table
// } = require('console');
// const {
//   create
// } = require('domain');
var path = require('path');
const sqlite = require('sqlite3').verbose(),
  asymetric = require('./asymetrics'),
  accountDb = new sqlite.Database(path.join(__dirname, '../config/account.db'), sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);

    console.log("Connection Successful");
  });

/**
 * Create user
 * This can only be done by the logged in user.
 *
 * body User Created user object
 * no response value expected for this operation
 **/

class operations {
  constructor(data) {
    this.data = data;
  }
  readOperations() {

  }
  createOperations() {
    switch (this.data.actions) {
      case "register":
        accountDb.run("create table if not exists users(id INTEGER PRIMARY KEY AUTOINCREMENT, fullName TEXT, phone TEXT, pin TEXT, type TEXT, category TEXT, role TEXT, token TEXT)");
        let cu = "INSERT INTO users (fullName, phone, pin, type, category, role, token)VALUES ( ?, ?, ?, ?, ?, ?, ?) RETURNING *";
        return new Promise((resolve, reject) => {
          accountDb.run(cu, [this.data.fullName, this.data.phone, this.data.pin, this.data.type, this.data.category, this.data.role, this.data.token], (err) => {
            if (err) {
              console.log(err.message);
              reject(console.error(err.message));
            } else {
              // accountDb.close((err) => {
              //   if (err) reject(console.error(err.message));
              // })
              resolve(200);
            }
          })
        });
    }
  }
  validations() {
    switch (this.data.actions) {
      case "token":
        let sta = asymetric.jwtVerify(this.data.token[1]);
        return sta;
      case "authentication":
        let su = "SELECT * FROM users where phone = '" + this.data.credential.phone + "' AND pin ='" + this.data.credential.pin + "' AND type = '" + this.data.type[0] + "' AND category = '" + this.data.category[0] + "'";
        return new Promise((resolve, reject) => {
          accountDb.all(su, function (err, rows) {
            if (err) {
              console.log(err.message);
              reject(console.error(err.message));
            } else {
              resolve(rows);
            }
          })
        });
    }
  }
  generate() {
    switch (this.data.actions) {
      case "token":
        return asymetric.generateToken(this.data);
    }
  }
}

exports.home = function (data) {
  return new Promise(function (resolve, reject) {
    let actionAuth = data;
    actionAuth.actions = "token";
    let opv = new operations(actionAuth);
    let resultToken = opv.validations();
    let notif= {};
    if(resultToken == 401){
        notif.responseCode = 401;
        notif.message = "Unauthorized access !";
    }else{
      let hasil = asymetric.decryptAes(resultToken.profile);
      let tmp = JSON.parse(hasil);
      if(data.category[0] == tmp.scope && tmp.role == "admin"){
        notif.responseCode = 200;
        notif.message = "Hello World,"+tmp.profile+","+tmp.role;
      }else if(data.category[0] == tmp.scope && tmp.role == "customer"){
        notif.responseCode = 200;
        notif.message = "Hello World,"+tmp.profile+","+tmp.role;
      }else{
        notif.responseCode = 401;
        notif.message = "Your access is UNAUTHORIZED,"+tmp.profile+" "+tmp.role;
      }
    }
    resolve(notif);
  })
}



exports.userLogin = function (data) {
  return new Promise(function (resolve, reject) {
    let actionAuth = data;
    actionAuth.actions = "authentication";
    let opv = new operations(actionAuth);
    let resultLogin = opv.validations();
    resultLogin.then(values => {
      let notif = '';
      if (values.length > 0) {
        let actionVal = values;
        actionVal.actions = "token";
        let opt = new operations(actionVal);
        let resultToken = opt.generate();
        notif = {
          "responseCode": 200,
          "message": "Success !",
          "data": resultToken
        };
      } else {
        notif = {
          "responseCode": 401,
          "message": "Unauthorized access !"
        };

      }
      resolve(notif);
    })
  })
}

exports.createUser = function (body) {
  return new Promise(function (resolve, reject) {
    console.log("CALLED")
    let actionToken = body;
    actionToken.actions = "token";
    let op = new operations(actionToken);
    let resultToken = op.generate();
    if (resultToken.token) {
      let actionOpc = body;
      actionOpc.actions = "register",
        actionOpc.token = resultToken.token;
      let opc = new operations(actionOpc);
      let ropc = opc.createOperations();
      ropc.then(values => {
        if (values == 200) {
          resolve({
            "responseCode": 200,
            "message": "Success !"
          });
        } else {
          resolve({
            "responseCode": 500,
            "message": "Internal server error"
          });
        }
      })
    }
  });
}



'use strict';
// const {
//   table
// } = require('console');
// const {
//   create
// } = require('domain');

const axios = require('axios');
let notif= {};

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
    switch (this.data.actions){
      case "getAllUser":
        let su = "SELECT * FROM users ";
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

  updateOperations(){
    switch (this.data.actions){
      case "updateProfile":
        let su = "UPDATE users SET fullName = '" + this.data.fullName + 
        "', birthDay = '" + this.data.birthDay +
        "', phone = '" + this.data.phone +
        "', pin ='" + this.data.pin +"' WHERE id = "+this.data.id+"";
        return new Promise((resolve, reject) => {
          accountDb.run(su, function (err, rows) {
            if (err) {
              console.log("DISINI ::", err.message);
              reject(console.error(err.message));
            } else {
              console.log("called")
              resolve(200);
            }
          })
        });
    }
  }
  createOperations() {
    switch (this.data.actions) {
      case "register":
        accountDb.run("create table if not exists users(id INTEGER PRIMARY KEY AUTOINCREMENT, fullName TEXT, birthDay TEXT, phone TEXT, pin TEXT, type TEXT, category TEXT, role TEXT)");
        let cu = "INSERT INTO users (fullName, birthDay, phone, pin, type, category, role)VALUES ( ?, ?, ?, ?, ?, ?, ?) RETURNING *";
        return new Promise((resolve, reject) => {
          accountDb.run(cu, [this.data.fullName, this.data.birthDay, this.data.phone, this.data.pin, this.data.type, this.data.category, this.data.role], (err) => {
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
        let su = "SELECT * FROM users where phone = '" + this.data.credential.phone +
        "' AND pin ='" + this.data.credential.pin + "' AND type = '" + this.data.type[0] +
        "' AND category = '" + this.data.category[0] + "'";
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


exports.updateUser = function (data) {
  return new Promise(function (resolve, reject) {
    let actionAuth = data;
    actionAuth.actions = "token";
    let opv = new operations(actionAuth);
    let resultToken = opv.validations();
    if(resultToken == 401){
        notif = {};
        notif.responseCode = 401;
        notif.message = "Unauthorized access !";
        resolve(notif);
    }else{
      let hasil = asymetric.decryptAes(resultToken.profile);
      let tmp = JSON.parse(hasil);
      data.actions = "updateProfile";
      if(data.id === undefined){
        data.id = tmp.id;
      }
       let opu = new operations(data);
      let ropu = opu.updateOperations();
      ropu.then(values => {
        if (values == 200) {
          resolve({
            "responseCode": 200,
            "message":  "Hi, "+tmp.profile+" your update has been success !"
          });
        } else {
          resolve({
            "responseCode": 500,
            "message": "Internal server error"
          });
        }
      })
    }
  })
}



exports.jobDetail = function (data) {
  return new Promise(function (resolve, reject) {
     let actionAuth = data;
    actionAuth.actions = "token";
    let opv = new operations(actionAuth);
    let resultToken = opv.validations();
    if(resultToken == 401){
        notif = {};
        notif.responseCode = 401;
        notif.message = "Unauthorized access !";
    }else{
      // Access authorized ===========

      let hasil = asymetric.decryptAes(resultToken.profile);
      let tmp = JSON.parse(hasil);
      axios
          .get('http://dev3.dansmultipro.co.id/api/recruitment/positions/'+data.jobId)
          .then(resax => {
            notif = {};
            notif.responseCode = resax.status;
            notif.message = "Hi "+tmp.profile+", this is your request result";
            notif.data = resax.data;
          })
          .catch(error => {
            notif = {};
            console.error(error);
            notif.responseCode = 500;
            notif.message = error;
          });
    }
        resolve(notif);
  })
}

exports.home = function (data) {
  return new Promise(function (resolve, reject) {
    let actionAuth = data;
    actionAuth.actions = "token";
    let opv = new operations(actionAuth);
    let resultToken = opv.validations();
    if(resultToken == 401){
        notif = {};
        notif.responseCode = 401;
        notif.message = "Unauthorized access !";
    }else{
      // Access authorized ===========

      let hasil = asymetric.decryptAes(resultToken.profile);
      let tmp = JSON.parse(hasil);
      let url = 'http://dev3.dansmultipro.co.id/api/recruitment/positions.json';
      if(data.description === undefined && data.location === undefined){
        url = url;
      }else if(data.description === 'empty' || !data.description && data.location){
        url = url+'?location='+data.location;
      }else if(data.location === 'empty' || !data.location && data.description){
         url = url+'?description='+data.description;
      }else if(data.description !== 'empty' && data.location !== 'empty'){
        url = url+'?description='+data.description+'&location='+data.location;
      }
      // if(data.description == "empty" ){
      //   // Request with param =========
      //   console.log("COBAAA", url+'?description='+data.description+'&location='+data.location)
      //   // url+'?description='+data.description+'&location='+data.location
      // }else{
      //   // Request without param ========
        
      // }
      console.log("testing", url)
      axios
        .get(url)
        .then(resax => {
          notif = {};
          notif.responseCode = resax.status;
          notif.message = "Hi "+tmp.profile+", this is your request result";
          notif.data = resax.data;
        })
        .catch(error => {
          notif = {};
          console.error(error);
          notif.responseCode = 500;
          notif.message = error;
        });
      // if(data.category[0] == tmp.scope && tmp.role == "admin"){
      //   notif.responseCode = 200;
      //   notif.message = "Hello World,"+tmp.profile+","+tmp.role;
      // }else if(data.category[0] == tmp.scope && tmp.role == "customer"){
      //   notif.responseCode = 200;
      //   notif.message = "Hello World,"+tmp.profile+","+tmp.role;
      // }else{
      //   notif.responseCode = 401;
      //   notif.message = "Your access is UNAUTHORIZED,"+tmp.profile+" "+tmp.role;
      // }
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

exports.getUser = function (data) {
  return new Promise(function (resolve, reject) {
    let actionAuth = data;
    actionAuth.actions = "token";
    let opv = new operations(actionAuth);
    let resultToken = opv.validations();
    if(resultToken == 401){
        notif = {};
        notif.responseCode = 401;
        notif.message = "Unauthorized access !";
        resolve(notif);
    }else{

      let hasil = asymetric.decryptAes(resultToken.profile);
      let tmp = JSON.parse(hasil);
      data.actions = "getAllUser";
       let opru = new operations(data);
      let ropru = opru.readOperations();
      ropru.then(values => {
        if (values.length > 0) {
          resolve({
            "responseCode": 200,
            "message":  "Hi, "+tmp.profile+" your update has been success !",
            "data":values
          });
        } else {
          resolve({
            "responseCode": 500,
            "message": "Internal server error"
          });
        }
      })

    }
  })
}


exports.createUser = function (body) {
  return new Promise(function (resolve, reject) {
    let actionOpc = body;
      actionOpc.actions = "register";
      let opc = new operations(actionOpc);
      let ropc = opc.createOperations();
      ropc.then(values => {
        if (values == 200) {
          resolve({
            "responseCode": 200,
            "message": "Hi, your create has been success !"
          });
        } else {
          resolve({
            "responseCode": 500,
            "message": "Internal server error"
          });
        }
  });
})
}



'use strict';
// const {
//   table
// } = require('console');
// const {
//   create
// } = require('domain');

const axios = require('axios');
const moment = require('moment');
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

  readOperations(){
    switch (this.data.actions){
      case "readNotif":
        let su = "SELECT * FROM notif where category = '" + this.data.category + "'";
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
      case "readBirthDay":
        // let cksn = "SELECT userTarget FROM sendNotif WHERE status = 'success'"
        let rb = "SELECT * FROM users";
        return new Promise((resolve, reject) => {
          accountDb.all(rb, function (err, rows) {
            if (err) {
              console.log(err.message);
              reject(console.error(err.message));
            } else {
              let data = [];
              let rnd = {};
              rnd.actions = "readNotif";
              rnd.category = "birthday";
              let oprn = new operations(rnd);
              let roprn = oprn.readOperations();
              roprn.then(vroprn => {
              if (vroprn.length > 0) {
                // console.log("SUKSES ::", vroprn);
                let csn = {};
                for(let a=0; a < rows.length; a++){
                  let tgl = moment(rows[a].birthDay, "DD-MM-YYYY").format('DD');
                  let month = moment(rows[a].birthDay, "DD-MM-YYYY").format('M');
                  let today = new Date().getDate();
                  let tm = new Date().getMonth()+ 1;
                  if(tgl == today && month == tm ){
                    for(let b=0; b < vroprn.length; b++){
                      csn.notif = rows[a].fullName+', '+vroprn[b].contentText;
                      csn.userTarget = rows[a].phone;
                      csn.type = "waNotif";
                      data.push(csn);
                    }
                  }else{
                    return false;
                  }
                }
                resolve(data);
              } else {
                console.log("GAGAL");
              }
            })
            }
          })
        });
    }
  }

  updateOperations(){
    switch (this.data.actions){
      case "updateNotif":
        let sun = "UPDATE notif SET contentText = '" + this.data.contentText + 
        "', type = '" + this.data.type +
        "', category = '" + this.data.category +"'";
        return new Promise((resolve, reject) => {
          accountDb.run(sun, function (err, rows) {
            if (err) {
              console.log(err.message);
              reject(console.error(err.message));
            } else {
              resolve(200);
            }
          })
        });
      case "updateSendNotif":
        let susn = "UPDATE sendNotif SET status = '" + this.data.status + 
        "', resendDate = '" + datetime('now', 'localtime') +"'";
        return new Promise((resolve, reject) => {
          accountDb.run(susn, function (err, rows) {
            if (err) {
              console.log(err.message);
              reject(console.error(err.message));
            } else {
              resolve(200);
            }
          })
        });
    }
  }
  createOperations() {
    switch (this.data.actions) {
      case "createNotif":
        accountDb.run("create table if not exists notif(id INTEGER PRIMARY KEY AUTOINCREMENT, contentText TEXT, type TEXT, category TEXT)");
        let cn = "INSERT INTO notif (contentText, type, category)VALUES ( ?, ?, ?) RETURNING *";
        return new Promise((resolve, reject) => {
          accountDb.run(cn, [this.data.contentText, this.data.type, this.data.category], (err) => {
            if (err) {
              console.log(err.message);
              reject(console.error(err.message));
            } else {
              resolve(200);
            }
          })
        });
      case "sendNotif":
        console.log("CALLED ::", this.data);
        accountDb.run("create table if not exists sendNotif(id INTEGER PRIMARY KEY AUTOINCREMENT, notif TEXT, userTarget TEXT, type TEXT, status TEXT, sendDate TEXT, resendDate TEXT)");
        let csn = "INSERT INTO sendNotif (notif, userTarget, type, status, sendDate)VALUES ( ?, ?, ?, ?, ?) RETURNING *";
        return new Promise((resolve, reject) => {
          accountDb.run(csn, [this.data.notif, this.data.userTarget, this.data.type, this.data.status, moment().format("DD-MM-YYYY")], (err) => {
            if (err) {
              console.log(err.message);
              reject(console.error(err.message));
            } else {
              resolve(200);
            }
          })
        })
    }
  }
  validations() {
    switch (this.data.actions) {
      case "token":
        let sta = asymetric.jwtVerify(this.data.token[1]);
        return sta;
      case "authentication":
        let su = "SELECT * FROM users where phone = '" + this.data.credential.phone +
        "' AND pin ='" + this.data.credential.pin +
        "' AND type = '" + this.data.type[0] +
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


exports.sendNotif = function () {
  return new Promise(function (resolve, reject) {
    let data = {};
    data.actions = "readBirthDay";
    let opb = new operations(data);
    let ropb = opb.readOperations();
     ropb.then(values => {
        if (values.length > 0) {
          for(let snc = 0; snc < values.length; snc++){
            values[snc].actions = 'sendNotif'; 
            axios({
                method: 'post',
                url: 'https://hookb.in/qB2XzDlM2jHnaNVqL2z8',
                data: JSON.stringify(values[snc])
              }).then(response => {
                if(response.status == 200){
                  values[snc].status = "success";
                  let opsn2 = new operations(values[snc]);
                  let ropsn2 = opsn2.createOperations();
                  ropsn2.then(values2 =>{
                    console.log("SUCESS ::", snc, values2)
                  })
                }
              }).catch(err => {
                values[snc].status = "failed";
                let opsn2 = new operations(values[snc]);
                let ropsn2 = opsn2.createOperations();
                ropsn2.then(values2 =>{
                  console.log("SUCESS ::", snc, values2)
                })
                console.log("EROR WOI==", err)
              });
          }

        } else {
          resolve({
            "responseCode": 500,
            "message": "Internal server error"
          });
        }
      })

  })
}



exports.getNotif = function (data) {
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
      data.actions = "readNotif";
      data.category = "birthday";
      let opn = new operations(data);
      let ropn = opn.readOperations();
      ropn.then(values => {
        console.log("values ::", values);
        if (values.length > 0) {
          resolve({
            "responseCode": 200,
            "message":  "Hi, "+tmp.profile+" your request has been success !",
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


exports.createNotif = function (data) {
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
      data.actions = "createNotif";
      let opc = new operations(data);
      let ropc = opc.createOperations();
      ropc.then(values => {
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
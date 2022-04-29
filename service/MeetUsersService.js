'use strict';

let mongoose = require('mongoose').set('debug', true);
let mongoConf = require('../config/mongoDb');
/**
 * Add a new pet to the store
 *
 * body Meetuser Pet object that needs to be added to the store
 * version Long tujuan access (api / app)
 * paging Long pagination data
 * i Long user id when type selected personal
 * api_key String signature
 * no response value expected for this operation
 **/
exports.addUser = function(body) {
  return new Promise(function(resolve, reject) {
    resolve(body);
  });
}

exports.getUsers = function(api_key,version,type,category,paging,i) {
  return new Promise(async function(resolve, reject) {
    // for(a=0; a<mongoConf.length; a++){   
    //   async () => { 
    //        const mongoStatus = await mongoose.connect(mongoConf[a]);
    //        switch(mongoStatus.connection.readyState){
    //            case 1:
    //                console.log("called");
    //                break;
    //          }
    //    }
    //   }
    var examples = {};
    examples['application/json'] = [ {
  "name" : mongoConf.dataConnection
}, {
  "name" : "name"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update an existing pet
 *
 * body Meetuser Pet object that needs to be added to the store
 * version Long tujuan access (api / app)
 * paging Long pagination data
 * i Long user id when type selected personal
 * api_key String signature
 * no response value expected for this operation
 **/
exports.updatePet = function(body,version,paging,i,api_key) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


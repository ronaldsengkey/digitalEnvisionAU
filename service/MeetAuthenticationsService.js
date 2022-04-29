'use strict';


/**
 * Finds users
 * Multiple status values can be provided with comma separated strings
 *
 * api_key String signature
 * version Long tujuan access (api / app)
 * category List Status values that need to be considered for filter
 * username String The user name for login
 * password String The password for login in clear text
 * returns List
 **/
exports.getAuthAccess = function(api_key,version,category,username,password) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "name" : "name"
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


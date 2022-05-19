'use strict';
require('dotenv').config();
const m = require('morgan'),
c = require('cluster');
let restana = require('restana')(),
fs = require('fs');
var path = require('path');
var http = require('http');

var oas3Tools = require('oas3-tools');
var serverPort = process.env.SERVICE_PORT;

let notif = require('./service/NotifService');


const schedule = require('node-schedule');
const job = schedule.scheduleJob('sendNotif','* 57 8 * * 0-6', function(){
  let test = notif.sendNotif();
  test.then(values => {
    console.log('The answer to life!', values);
  })
});

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
flags: 'a+'
})

restana.use(m('combined', {
    stream: accessLogStream
}));

restana = expressAppConfig.getApp();


if (c.isMaster) {

    // check console.log(`Master ${process.pid} is running`);
    // console.log('master cluster setting up ' + numCPUs + ' workers')

    // Fork workers.
    for (let i = 0; i < 1; i++) {
      c.fork();
    }
    c.on('online', function (worker, code, signal) {
    //   console.log('Worker ' + worker.process.pid + ' is online');
    })
    //Check if work is died
    c.on('exit', (worker, code, signal) => {
    //   console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    //   console.log('Starting a new worker');
      c.fork();
    });

  } else {
    let worker = c.worker.id;
    // Start the server
    const start = async () => {
      try {
          // Initialize the Swagger middleware
          await http.createServer(restana).listen(serverPort, async () => {
            });
      } catch (err) {
        console.log(err)
        process.exit(1)
      }
    }
    start()
  }


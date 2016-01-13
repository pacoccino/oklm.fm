'use strict';
// Api-only launcher

var connector = require('./../modules/socketconnector')();
var ApiServer = require('./../modules/api');
var Logger = require('./../modules/logger');

connector.listenAsApi(function(error) {
  
  if(!error) {
    var apiServer = new ApiServer(connector);
  }
  else {
    Logger.error("Api sever failed to connect to crawler. Shutting down...", error.socketErr);
    process.exit(-1);
  }
});

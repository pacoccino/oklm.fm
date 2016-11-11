'use strict';
// Api-only launcher

var connector = require('./../modules/socketconnector')();
var ApiServer = require('./../modules/api');
var WebServer = require('../modules/static');
var Logger = require('./../modules/logger');
const Config = require('../modules/config');

Logger.fileLogByProcessType("api");

Logger.info("Starting API server...");

// TODO regler le client pour taper sur cette API si on separe.
connector.listenAsApi(function(error) {
  
  if(!error) {

    WebServer.initExpress(Config.api);

    var apiServer = new ApiServer();
    apiServer.initializeApiServer(WebServer.app);
    apiServer.linkConnector(connector);

    WebServer.listen();
  }
  else {
    Logger.error("Api sever failed to connect to crawler. Shutting down...", error.socketErr);
    process.exit(-1);
  }
});

process.on('SIGINT', function () {
  Logger.info('Stopping server ...');
  process.exit(0);
});
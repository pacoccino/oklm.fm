'use strict';
// Static-only launcher

const WebServer = require('../modules/static');
var Logger = require('./../modules/logger');

Logger.fileLogByProcessType("static");

Logger.info("Starting static web server...");

WebServer.launch();

process.on('SIGINT', function () {
    Logger.info('Stopping server ...');
    process.exit(0);
});
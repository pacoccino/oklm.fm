'use strict';
// Static-only launcher

const WebServer = require('../modules/static');
var Logger = require('./../modules/logger');
const Config = require('../modules/config');

Logger.fileLogByProcessType("static");

Logger.info("Starting static web server...");

WebServer.initExpress(Config.static);
WebServer.static();
WebServer.listen();

process.on('SIGINT', function () {
    Logger.info('Stopping server ...');
    process.exit(0);
});
'use strict';

var connector = require('./../modules/thriftyconnector')();

var Logger = require('./../modules/logger');
var ApiServer = require('./../modules/api');
var Crawler = require('./../modules/crawler');
var WebServer = require('../modules/static');

Logger.fileLogByLaunchTime("thrifty");
Logger.info("Starting all-in-one server...");

var apiServer = new ApiServer(connector);
var crawler = new Crawler(connector);

WebServer.launch();

process.on('SIGINT', function () {
    Logger.info('Stopping server ...');
    process.exit(0);
});
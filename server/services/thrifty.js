'use strict';

var connector = require('./../modules/thriftyconnector')();

var ApiServer = require('./../modules/api');
var Crawler = require('./../modules/crawler');
const WebServer = require('../modules/static');

var apiServer = new ApiServer(connector);
var crawler = new Crawler(connector);
WebServer.launch();
'use strict';
// Crawler-only launcher

var connector = require('./../modules/socketconnector')();
var Crawler = require('./../modules/crawler');

connector.listenAsCrawler();
var worker = new Crawler(connector);


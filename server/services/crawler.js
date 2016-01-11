'use strict';
// Crawler-only launcher

var connector = require('./../modules/socketconnector')();
var Crawler = require('./../modules/crawler');

connector.listenAsCrawler();
var crawler = new Crawler(connector);


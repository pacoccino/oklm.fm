'use strict';
// Crawler-only launcher

var connector = require('./../modules/socketconnector')();
var Crawler = require('./../modules/crawler');
var Logger = require('./../modules/logger');

Logger.fileLogByProcessType("crawler");

Logger.info("Starting crawler server...");

connector.listenAsCrawler(function(error) {

  if(error) {
    
    throw error;
    
  } else {
    var crawler = new Crawler();

    crawler.linkConnector(connector);
    crawler.initCrawler();
  }

});

process.on('SIGINT', function () {
  Logger.info('Stopping server ...');
  process.exit(0);
});
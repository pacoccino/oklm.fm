'use strict';
// Crawler-only launcher

var connector = require('./../modules/socketconnector')();
var Crawler = require('./../modules/crawler');
var Logger = require('./../modules/logger');

connector.listenAsCrawler(function(error) {

  if(error) {
    
    throw error;
    
  } else {
    
    var crawler = new Crawler(connector);
  }

});


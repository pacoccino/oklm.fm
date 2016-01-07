// Web-only launcher

var connector = require('./modules/socketconnector')();
var WebServer = require('./modules/web');

connector.listenAsWeb();
var webServer = new WebServer(connector);

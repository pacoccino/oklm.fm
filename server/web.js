var connector = require('./modules/socketconnector')();
var WebServer = require('./modules/web');

var webServer = new WebServer(connector);

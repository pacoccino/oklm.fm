// Web-only launcher

var connector = require('./modules/socketconnector')();
var WebServer = require('./modules/web');
var Logger = require('./logger');

connector.listenAsWeb(function(error) {
    if(!error) {
        Logger.info("Web sever successfuly connected to worker");
        var webServer = new WebServer(connector);
    }
    else {
        Logger.error("Web sever failed to connect to worker after " + error.nbAttempts + " attempts. Shutting down...", error.socketErr);
        process.exit(-1);
    }
});

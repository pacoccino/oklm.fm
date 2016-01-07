// Worker-only launcher

var connector = require('./modules/socketconnector')();
var Worker = require('./modules/worker');

connector.listenAsWorker();
var worker = new Worker(connector);


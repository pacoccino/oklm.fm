var connector = require('./modules/socketconnector')();
var Worker = require('./modules/worker');

var worker = new Worker(connector);


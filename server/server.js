// Thrifty launcher
// Launches all-in-one web+worker instance

var Worker = require('./modules/worker');
var Web = require('./modules/web');
var connector = require('./modules/thriftyconnector')();

var worker = new Worker(connector);
var web = new Web(connector);

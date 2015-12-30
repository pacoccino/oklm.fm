
var WorkerServer = require('./modules/worker');
var WebServer = require('./modules/web');

var workerServer = new WorkerServer();
var webServer = new WebServer(workerServer);

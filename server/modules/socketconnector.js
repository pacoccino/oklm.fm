var EventEmitter = require('events').EventEmitter;
var socketio = require('socket.io');
var http = require('http');

var Config = require('./config');

var Connector = function() {
    EventEmitter.call(this);
};

Connector.prototype = Object.create(EventEmitter.prototype);

Connector.prototype.listenAsWorker = function() {
    // Bind socket port
    // broadcasts to web(s)

    var server = http.createServer();
    server.listen(Config.workerPort);

    var io = socketio(server);

    this.on('event', function(data) {
        io.emit('event', data);
    });
};
Connector.prototype.listenAsWeb = function() {
    var self = this;
    // Connect to worker socket
    // On server socket, emit
    var serverSocket = socketio(Config.workerUrl + ':' + Config.workerPort);

    serverSocket.on('event', function(data) {
        self.emit('event', data);
    });
};

module.exports = function() {
    return new Connector();
};
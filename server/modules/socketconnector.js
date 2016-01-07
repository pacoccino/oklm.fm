var EventEmitter = require('events').EventEmitter;
var socketio = require('socket.io');
var http = require('http');

var Config = require('./config');

var Connector = function() {
    EventEmitter.call(this);

    this.binded = false;
};

Connector.prototype = Object.create(EventEmitter.prototype);

Connector.prototype.listenAsWorker = function() {
    // Bind socket port
    // broadcasts to web(s)

    if(this.binded) return;

    var server = http.createServer();
    server.listen(Config.workerPort);

    var io = socketio(server);

    this.on('event', function(data) {
        io.emit('event', data);
    });
};

Connector.prototype.listenAsWeb = function() {
    // Connect to worker socket
    // On server socket, emit

    if(this.binded) return;

    var self = this;
    var serverSocket = socketio(Config.workerUrl + ':' + Config.workerPort);

    serverSocket.on('event', function(data) {
        self.emit('event', data);
    });
};

module.exports = function() {
    return new Connector();
};
var EventEmitter = require('events').EventEmitter;
var socketio = require('socket.io');
var http = require('http');

var Logger = require('./logger');
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

    var sillyMiddleware = function(req,res) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("Worker empty http server");
    };
    var server = http.createServer(sillyMiddleware);
    server.listen(Config.workerPort);

    var io = socketio(server);

    this.on('event', function(data) {
        io.emit('event', data);
    });

    this.binded = true;
};

Connector.prototype.listenAsWeb = function(callback) {
    // Connect to worker socket
    // On server socket, emit

    if(this.binded) return;

    var self = this;
    var serverSocket = socketio(Config.workerUrl + ':' + Config.workerPort);

    var connectionError = {
        nbAttempts: 0,
        socketErr: null
    };

    var maxAttempts = 5;
    var tryToConnect = function(cb) {

        serverSocket.connect(function(error) {
            if(!error) {
                serverSocket.on('event', function(data) {
                    self.emit('event', data);
                });

                self.binded = true;

                callback(null)
            }
            else {
                if(connectionError.nbAttempts < maxAttempts) {
                    Logger.warning("Failed to connect to worker server, retrying...");
                    connectionError.nbAttempts++;
                    tryToConnect();
                }
                else {
                    connectionError.socketErr = error;
                    cb(connectionError);
                }
            }
        });
    };

    tryToConnect();
};

module.exports = function() {
    return new Connector();
};
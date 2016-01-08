var EventEmitter = require('events').EventEmitter;
var socketioServer = require('socket.io');
var socketioClient = require('socket.io-client');
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

    var self = this;

    if(this.binded) return;

    var sillyMiddleware = function(req,res) {
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("Worker empty http server");
    };
    var server = http.createServer(sillyMiddleware);
    server.listen(Config.workerPort);

    var io = socketioServer(server);

    io.on('connect', function(socket) {
        Logger.info('New webserver connected');

        self.emit('newsocket');

        socket.on('disconnect', function() {
            Logger.info('Webserver disconnected');
        });
    });


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
    var serverSocket = socketioClient('http://' + Config.workerUrl + ':' + Config.workerPort);

    var connectionError = {
        nbAttempts: 0,
        socketErr: null
    };

    var maxAttempts = 5;
    var onConnected = function() {
        Logger.info("Successfuly connected to worker");

        serverSocket.on('disconnect', function() {
            Logger.warning("Worker disconnected, shutting down ...");

            process.exit(0);
        });

        callback(null);
    };

    var tryToConnect = function(cb) {

        serverSocket.on('connect', function(error) {
            if(!error) {
                serverSocket.on('event', function(data) {
                    self.emit('event', data);
                });

                self.binded = true;
                onConnected();
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
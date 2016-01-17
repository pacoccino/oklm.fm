"use strict";

var http = require('http');
http.globalAgent.maxSockets = Infinity;

var express = require('express');
var socketio = require('socket.io');

const Config = require('./config');
var Logger = require('./logger');

class Api {

    constructor(connector) {
        if(!connector) return;

        this.songInfo = null;
        this.songHistory = null;

        this.initializeApiServer();
        this.linkConnector(connector);
    }

    initializeApiServer() {

        var self = this;
        var app = express();

        app.set('port', Config.api.port);
        
        app.use(function(req, res, next){
            Logger.silly(`New connection on process api ${process.pid}`);

            next();
        });
        
        app.server = http.createServer(app);
        app.server.listen(app.get('port'), () => {
            Logger.info(`API server listen on ${app.get('port')}`);
        });

        self.io = socketio(app.server);

        self.io.on('connection', function (socket) {
            Logger.silly(`New client ws on process web ${process.pid}`);

            if(self.songInfo) {
                socket.emit(Config.messages.songInfo, self.songInfo);
            }
            if(self.songHistory) {
                socket.emit(Config.messages.songHistory, self.songHistory);
            }
        });
    };

    linkConnector(connector) {
        connector.on('event', this.workerEvent.bind(this))
    }

    workerEvent(event) {
        if(!event) return;

        switch(event.type) {
            case Config.messages.songInfo:
                this.newSongInfo(event.data);
                break;
            case Config.messages.songHistory:
                this.newSongHistory(event.data);
                break;
        }
    };

    newSongInfo(songinfo) {
        Logger.silly("Broadcast song info");

        this.songInfo = songinfo;

        this.broadcast(Config.messages.songInfo, this.songInfo);
    };

    newSongHistory(history) {
        Logger.silly("Broadcast song history");

        this.songHistory = history;

        this.broadcast(Config.messages.songHistory, this.songHistory);
    };

    broadcast(message, data) {
        this.io.emit(message, data);
    };
}

module.exports = Api;
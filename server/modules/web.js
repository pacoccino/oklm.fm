"use strict";

var express = require('express');
var socketio = require('socket.io');

var Config = require('./config.js');
var Logger = require('./logger');

class WebServer {

    constructor(connector) {
        if(!connector) return;

        this.songInfo = null;
        this.songHistory = null;

        this.initializeWebServer();
        this.linkConnector(connector);

        Logger.info("Web ready");
    }

    initializeWebServer() {

        var self = this;
        var app = express();

        app.set('port', Config.webPort);

        app.use(express.static(Config.publicFolder));

        var server = app.listen(app.get('port'));

        self.io = socketio(server);

        self.io.on('connection', function (socket) {
            Logger.silly("New socket");

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

module.exports = WebServer;
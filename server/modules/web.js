"use strict";

var express = require('express');
var socketio = require('socket.io');

var Config = require('../config.json');
var Logger = require('./logger');

class WebServer {

    constructor(connector) {
        if(!connector) return;

        this.songInfo = null;

        this.initializeWebServer();
        this.linkConnector(connector);

        Logger.info("Web ready");
    }

    initializeWebServer() {

        var self = this;
        var app = express();

        app.set('port', process.env.PORT || Config.port);

        app.use(express.static(Config.appFolder));

        var server = app.listen(app.get('port'));

        self.io = socketio(server);

        self.io.on('connection', function (socket) {
            Logger.silly("New socket");

            if(self.songState) {
                socket.emit('songinfo', self.songInfo);
            }
        });
    };

    linkConnector(connector) {
        connector.on('event', this.workerEvent.bind(this))
    }

    workerEvent(event) {
        if(!event) return;

        switch(event.type) {
            case "songinfo":
                this.newSongInfo(event.data);
                break;
        }
    };

    newSongInfo(songinfo) {
        Logger.silly("Broadcast songinfo");

        this.songInfo = songinfo;

        this.broadcast(Config.messages.songInfo, this.songInfo);
    };

    broadcast(message, data) {
        this.io.emit(message, data);
    };
}

module.exports = WebServer;
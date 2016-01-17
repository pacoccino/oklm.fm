"use strict";

//var request = require('./fakerequest');
var request = require('request');
var Config = require('./config');
var Logger = require('./logger');

class CrawlWorker {

    constructor(connector) {
        this.songState = {
            artist: null,
            title: null
        };

        this.songHistory = [];

        this.linkConnector(connector);

        this.initCrawler();

        Logger.info("Crawler ready");
    }

    initCrawler() {
        var updater = this.updateApi.bind(this);
        setInterval(updater, Config.crawler.interval);
        this.getLive();
    };

    linkConnector(connector) {
        this.connector = connector;

        this.connector.on('newsocket', this.broadcastAllinfos.bind(this));
    }

    notifyApiServers(event) {
        this.connector.emit('event', event);
    };

    static newSongEvent(song) {
        var event = {};

        event.type = Config.messages.songInfo;
        event.data = song;

        return event;
    }
    static historyEvent(songs) {
        var event = {};

        event.type = Config.messages.songHistory;
        event.data = songs;

        return event;
    }

    static isDifferentSong(song1, song2) {
        return (song1.artist !== song2.artist || song1.title !== song2.title);
    }

    broadcastAllinfos(socket) {
        var eventSong = CrawlWorker.newSongEvent(this.songState);
        var eventHistory = CrawlWorker.historyEvent(this.songHistory);

        socket.emit('event', eventSong);
        socket.emit('event', eventHistory);
    }

    getLive() {
        var self = this;
        var url = Config.apiRadioUrl + "track/live";

        var requestObject  = {
            url: url,
            method: "GET",
            json: true
        };

        request(requestObject, function(error, response, body) {
            if (!error && response.statusCode === 200 && body.status === 'success') {

                var song = body.data;
                if(CrawlWorker.isDifferentSong(self.songState, song)) {

                    Logger.silly("New song info");
                    self.songState = song;

                    var event = CrawlWorker.newSongEvent(song);
                    self.notifyApiServers(event);
                    self.getHistory();
                }
            }
            else {
                Logger.error(error);
            }
        });
    };

    getHistory() {
        var self = this;
        var limit = 20;
        var url = Config.apiRadioUrl + "track/ckoi?limit="+limit;

        var requestObject  = {
            url: url,
            method: "GET",
            json: true
        };

        request(requestObject, function(error, response, body) {
            if (!error && response.statusCode === 200 && body.status === 'success') {

                var songs = body.data;
                if(self.songHistory.length === 0 || CrawlWorker.isDifferentSong(songs[0], self.songHistory[0])) {
                    Logger.silly("New song history");

                    self.songHistory = songs;

                    var event = CrawlWorker.historyEvent(songs);
                    self.notifyApiServers(event);
                }
            }
            else {
                Logger.error(error);
            }
        });
    };

    updateApi() {
        this.getLive();
    };
}

module.exports = CrawlWorker;
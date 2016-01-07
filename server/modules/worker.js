"use strict";

//var request = require('./fakerequest');
var request = require('request');
var Config = require('../config.json');

var apiUrl = "http://oklmtitle.radioking.fr/api/radio/" + Config.radioId + "/";

class CrawlWorker {

    constructor(connector) {
        this.songState = {
            artist: null,
            title: null
        };

        this.songHistory = [];

        this.linkConnector(connector);

        this.initCrawler();

        console.log("Worker ready");
    }

    initCrawler() {
        var updater = this.updateApi.bind(this);
        setInterval(updater, Config.crawlInterval);
        this.getLive();
        this.getHistory();
    };

    linkConnector(connector) {
        this.connector = connector;
    }

    notifyWebServers(event) {
        this.connector.emit('event', event);
    };

    static newSongEvent(song) {
        var event = {};

        event.type = "songinfo";
        event.data = song;

        return event;
    }
    static historyEvent(songs) {
        var event = {};

        event.type = "songhistory";
        event.data = songs;

        return event;
    }

    static isDifferentSong(song1, song2) {
        return (song1.artist !== song2.artist || song1.title !== song2.title);
    }

    getLive() {
        var self = this;
        var url = apiUrl + "track/live";

        var requestObject  = {
            url: url,
            method: "GET",
            json: true
        };

        request(requestObject, function(error, response, body) {
            if (!error && response.statusCode === 200 && body.status === 'success') {

                var song = body.data;
                if(Worker.isDifferentSong(self.songState, song)) {
                    self.songState = song;

                    var event = CrawlWorker.newSongEvent(song);
                    self.notifyWebServers(event);
                    self.getHistory();
                }
            }
        });
    };

    getHistory() {
        var self = this;
        var limit = 20;
        var url = apiUrl + "track/ckoi?limit="+limit;

        var requestObject  = {
            url: url,
            method: "GET",
            json: true
        };

        request(requestObject, function(error, response, body) {
            if (!error && response.statusCode === 200 && body.status === 'success') {

                var songs = body.data;
                if(self.songHistory.length === 0 || Worker.isDifferentSong(songs[0], self.songHistory[0])) {
                    self.songHistory = songs;

                    var event = CrawlWorker.historyEvent(songs);
                    self.notifyWebServers(event);
                }
            }
            else {
                console.log("error", error);
            }
        });
    };

    updateApi() {
        this.getLive();
    };
}

module.exports = CrawlWorker;
"use strict";

var request = require('./fakerequest');
//var request = require('request');
var Config = require('../config.json');

var apiUrl = "http://oklmtitle.radioking.fr/api/radio/" + Config.radioId + "/";

class CrawlWorker {

    constructor() {
        this.songState = {
            artist: null,
            title: null
        };

        this.webServers = [];

        this.initCrawler();

        console.log("Worker ready");
    }

    initCrawler() {
        var updater = this.updateApi.bind(this);
        setInterval(updater, Config.crawlInterval);
    };

    registerWebServer(webServer) {
        if(!(webServer && webServer.workerEvent)) return;

        this.webServers.push(webServer);

        //TODO put on map
    };

    notifyWebServers(event) {
        for (var i = 0; i < this.webServers.length; i++) {
            var webServer = this.webServers[i];
            webServer.workerEvent(event);
        }
    };

    static newSongEvent(song) {
        var event = {};

        event.type = "songinfo";
        event.data = song;

        return event;
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
                if(self.songState.artist !== song.artist || self.songState.title !== song.title) {
                    self.songState = song;

                    var event = CrawlWorker.newSongEvent(song);
                    self.notifyWebServers(event);
                }
            }
        });
    };

    getHistory() {
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
                //console.log(songs.length);
            }
            else {
                console.log("error", error);
            }
        });
    };

    updateApi() {
        this.getLive();
        //getHistory();
    };
}

module.exports = CrawlWorker;
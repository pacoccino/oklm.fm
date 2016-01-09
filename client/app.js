var angularApp = angular.module('oklm.fm', []);

angularApp.controller('Ctrl', ['$scope', '$interval', function($scope, $interval) {

    var audioElement = null;

    var uris = {
        r: "http://62.210.247.11/radio/3093",
        c: "http://oklmtitle.radioking.fr/api/track/cover/"
    };

    var slogans = [
        "Radio pirate",
        "Ecoutez la radio dans le plus grand des calmes",
        "Première sur le Rap",
        "La couronne sur la tête"
    ];

    $scope.playing = false;
    $scope.song = {};
    $scope.motto = "Radio Pirate";
    $scope.history = [];
    $scope.historyOpened = false;

    $scope.openHistory = function() {
        ga('send', 'event', 'history', 'open');

        $scope.historyOpened = true;
    };
    $scope.closeHistory = function() {
        ga('send', 'event', 'history', 'close');

        $scope.historyOpened = false;
    };

    var safePlay = function () {
        if ($scope.playing) {
            audioElement.load();
            audioElement.play();
        }
    };

    $scope.play = function() {
        if (!audioElement) return;

        $scope.playing = true;
        safePlay();
        setTimeout(safePlay, 30 * 60 * 1000);

        ga('send', 'event', 'play');
    };

    $scope.pause = function() {
        if (!audioElement) return;

        $scope.playing = false;
        audioElement.pause();

        ga('send', 'event', 'pause');
    };

    var playpause = function () {
        $scope.playing ? $scope.pause() : $scope.play();
    };

    var browserIncompatible = function () {
        alert("Votre navigateur est incompatible, veuillez utiliser l'application officielle");
        window.location = "http://www.oklmradio.com/";
    };

    var audiolink = function () {
        audioElement.setAttribute('src', uris.r);
    };

    var addEvents = function () {
        $(document).keypress(function (e) {
            if (e.charCode === 32) {
                ga('send', 'event', 'spacebar');
                playpause();
            }
        });

        $('#playstore').click(function() {
            ga('send', 'event', 'mobileapp', 'play store');
        });
        $('#applestore').click(function() {
            ga('send', 'event', 'mobileapp', 'apple store');
        });
        $('#informations').click(function() {
            ga('send', 'event', 'informations');
        });
        $('#deezer-search').click(function() {
            ga('send', 'event', 'searchsong', 'deezer');
        });
        $('#itunes-search').click(function() {
            ga('send', 'event', 'searchsong', 'itunes');
        });
    };

    var roundSlogan = function() {

        var sId = Math.floor(Math.random() * 1000) % slogans.length;
        $scope.motto = slogans[sId];
    };

    var cleanString = function(str) {
        str = str || "";
        var res = str.toLowerCase();

        res = res.replace('(', '');
        res = res.replace(')', '');

        var iFeat = res.indexOf('feat');
        if(iFeat !== -1) {
            res = res.substr(0, iFeat);
        }

        return res;
    };

    var getSearchString = function(song) {
        return cleanString(song.artist) + " " + cleanString(song.title);
    };

    var deezerLink = function(song) {
        return "http://www.deezer.com/search/" + getSearchString(song);
    };

    var updateSongInfo = function(data) {
        $scope.song = data;

        if(data.artist && data.title) {
            $scope.song.deezerUrl = deezerLink(data);
        }
        else {
            $scope.song.deezerUrl = null;
        }
    };

    var updateSongHistory = function(data) {
        $scope.history = data;
    };

    $scope.historyExternalHref = function(song) {
        return song.buy_link;
    };

    var init = function () {

        audioElement = document.createElement('audio');

        if (!audioElement.canPlayType('audio/mpeg')) {
            browserIncompatible();
            return;
        }
        audiolink();

        var socket = io();
        socket.on('songinfo', updateSongInfo);
        socket.on('songhistory', updateSongHistory);

        addEvents();

        roundSlogan();
        $interval(roundSlogan, 20 * 1000);
        $scope.play();
    };

    init();
}]);
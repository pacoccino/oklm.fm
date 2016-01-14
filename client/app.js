var angularApp = angular.module('oklm.fm', []);

angularApp.directive('clickout', ['$timeout', function($timeout) {

    return {
        restrict: 'A',
        scope: { clickoutFn: '&' },
        link: function(scope, element) {
            var checkMe = function(event) {
                if(element.find(event.target).length !== 0) {
                    return;
                }
                if($(event.target).hasClass('coo')) {
                    return;
                }
                $timeout(function() {
                    scope.clickoutFn()();
                });
            };

            $(document).click(checkMe);
        }
    };
}]);

angularApp.controller('Ctrl', ['$scope', '$interval', '$timeout', '$window', function($scope, $interval, $timeout, $window) {

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
    $scope.song = {
        coverUrl: "assets/images/pirates.jpg"
    };
    $scope.motto = "Radio Pirate";
    $scope.history = [];
    $scope.historyOpened = false;
    $scope.historyOpenedD = false;

    var onces = {
        firstPlay: true
    };

    $scope.openHistory = function() {

        ga('send', 'event', 'history', 'open');

        $scope.historyOpened = true;

        $timeout(function() {
            $scope.historyOpenedD = true;
        });
    };
    $scope.closeHistory = function() {
        if($scope.historyOpened) {
            ga('send', 'event', 'history', 'close');

            $scope.historyOpenedD = false;

            $timeout(function() {
                $scope.historyOpened = false;
            }, 700);
        }
    };

    var safePlay = function () {
        //return;

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

        if(onces.firstPlay) {
            onces.firstPlay = false;
        }
        else {
            ga('send', 'event', 'play');
        }
    };

    $scope.pause = function() {
        if (!audioElement) return;

        $scope.playing = false;
        audioElement.pause();

        ga('send', 'event', 'pause');
    };

    $scope.playpause = function () {
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
                $timeout($scope.playpause);
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

        res = res.replace(/\(/g, '');
        res = res.replace(/\)/g, '');

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

        if(data.cover) {
            $scope.song.coverUrl = uris.c + data.cover;
        }
    };

    var updateSongHistory = function(data) {
        $scope.history = data;
    };

    $scope.openExternal = function(song, type, fromHistory) {

        var url = null;
        switch(type) {
            case 'itunes':
                url = song.buy_link;
                break;
            case 'deezer':
                url = deezerLink(song);
                break;
        }

        if(url) {
            ga('send', 'event', 'searchsong', type, fromHistory ? 'fromHistory' : false);

            $window.open(url, '_blank');
        }
    };

    var asyncAngularify = function(fn) {
        return function(data) {
            $timeout(function() {
                fn(data);
            });
        };
    };

    var init = function () {

        audioElement = document.createElement('audio');

        if (!audioElement.canPlayType('audio/mpeg')) {
            browserIncompatible();
            return;
        }
        audiolink();

        var socket = io();
        socket.on('songinfo', asyncAngularify(updateSongInfo));
        socket.on('songhistory', asyncAngularify(updateSongHistory));

        addEvents();

        roundSlogan();
        $interval(roundSlogan, 20 * 1000);
        $scope.play();
    };

    init();
}]);
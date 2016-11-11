angularApp.controller('Ctrl', ['$scope', '$interval', '$timeout', '$window', 'songService', function($scope, $interval, $timeout, $window, songService) {

    var audioElement = null;

    var uris = {
        r: "http://163.172.6.199/radio/3093",
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
            ga('send', 'event', 'mediactrl', 'play');
        }
    };

    $scope.pause = function() {
        if (!audioElement) return;

        $scope.playing = false;
        audioElement.pause();

        ga('send', 'event', 'mediactrl', 'pause');
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
                ga('send', 'event', 'keyboard', 'spacebar');
                $timeout($scope.playpause);
            }
        });

        $('#playstore').click(function() {
            ga('send', 'event', 'mobileapp', 'play store');
        });
        $('#applestore').click(function() {
            ga('send', 'event', 'mobileapp', 'apple store');
        });
        $('#oklmradio').click(function() {
            ga('send', 'event', 'miscpages', 'oklmradio');
        });
        $('#legal').click(function() {
            ga('send', 'event', 'miscpages', 'informations');
        });
        $('#mailto').click(function() {
            ga('send', 'event', 'miscpages', 'contact');
        });
    };

    var updateSongInfo = function(data) {
        $scope.song = data;

        if(data.cover) {
            $scope.song.coverUrl = uris.c + data.cover;
        }
    };

    var updateSongHistory = function(data) {
        $scope.history = data;
    };

    $scope.openExternal = function(song, type, fromHistory) {

        ga('send', 'event', 'searchsong', type, fromHistory ? 'fromHistory' : false);

        songService.openExternal(song, type);
    };

    var roundSlogan = function() {

        var sId = Math.floor(Math.random() * 1000) % slogans.length;
        $scope.motto = slogans[sId];
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

        var socket = io('/');
        socket.on('songinfo', asyncAngularify(updateSongInfo));
        socket.on('songhistory', asyncAngularify(updateSongHistory));

        addEvents();

        roundSlogan();
        $interval(roundSlogan, 20 * 1000);
        $scope.play();

        setTimeout(function(){
            ga('send', 'event', 'useless', 'nobouncerate');
        }, 60 * 1000);
    };

    init();
}]);
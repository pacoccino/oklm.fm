(function() {
    var audioElement = null;
    var domElements = {};
    var playing = true;

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

    var memory = function () {
        if (playing) {
            audioElement.load();
            audioElement.play();
        }
    };

    var play = function () {
        if (!audioElement) return;

        domElements.cover && domElements.cover.removeClass("fade");
        domElements.pauseBtn && domElements.pauseBtn.show();
        domElements.playBtn && domElements.playBtn.removeClass("pause");

        playing = true;
        memory();

        setTimeout(memory, 30 * 60 * 1000);

        ga('send', 'event', 'mediactrl', 'play');
    };

    var pause = function () {
        if (!audioElement) return;

        domElements.cover && domElements.cover.addClass("fade");
        domElements.pauseBtn && domElements.pauseBtn.hide();
        domElements.playBtn && domElements.playBtn.addClass("pause");

        audioElement.pause();

        playing = false;

        ga('send', 'event', 'mediactrl', 'pause');
    };

    var playpause = function () {

        playing ? pause() : play();
    };

    var browserIncompatible = function () {
        alert("Votre navigateur est incompatible, veuillez utiliser l'application officielle");
        window.location = "http://www.oklmradio.com/";
    };

    var cleanSearchString = function(str) {
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

    var updateSonginfo = function (data) {

        domElements.artist.text(data.artist || "");
        domElements.title.text(data.title || "");

        if (data.buy_link) {
            domElements.itunes.attr("href", data.buy_link);
            domElements.itunes.show();
        }
        else {
            domElements.itunes.attr("href", null);
            domElements.itunes.hide();
        }

        if (data.cover) {
            domElements.cover.attr("src", uris.c + data.cover);
            domElements.coverBg.attr("src", uris.c + data.cover);
        }

        if(data.artist && data.title) {
            var searchString = cleanSearchString(data.artist) + " " + cleanSearchString(data.title);
            var href = "http://www.deezer.com/search/" + searchString;
            domElements.deezerSearch.attr("href", encodeURI(href));
            domElements.deezerSearch.show();
        }
        else {
            domElements.deezerSearch.hide();
        }
    };

    var jquelink = function () {

        domElements.cover = $("#cover");
        domElements.coverBg = $("#cover-bg");
        domElements.playBtn = $("#cover-resume");
        domElements.pauseBtn = $("#cover-pause");
        domElements.artist = $("#SI-artist");
        domElements.title = $("#SI-title");
        domElements.slogan = $(".slogan");
        domElements.deezerSearch = $("#deezer-search");
        domElements.itunes = $("#itunes-search");

        domElements.pauseBtn.click(pause);
        domElements.playBtn.click(play);
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
            ga('send', 'event', 'miscpages', 'informations');
        });
        $('#deezer-search').click(function() {
            ga('send', 'event', 'searchsong', 'deezer');
        });
        $('#itunes-search').click(function() {
            ga('send', 'event', 'searchsong', 'itunes');
        });
    };

    var showSlogan = function() {

        var sId = Math.floor(Math.random() * 1000) % slogans.length;
        var slogan = slogans[sId];

        domElements.slogan.text(slogan);
    };

    var init = function () {

        audioElement = document.createElement('audio');

        jquelink();

        if (!audioElement.canPlayType('audio/mpeg')) {
            browserIncompatible();
            return;
        }

        audiolink();

        var socket = io('http://api.oklm.fm');
        socket.on('songinfo', function (data) {
            updateSonginfo(data);
        });

        addEvents();

        showSlogan();
        setInterval(showSlogan, 20 * 1000);
        play();
    };

    $(document).ready(init);
})();
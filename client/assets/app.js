(function() {
    var eve = null;
    var domElements = {};
    var p = true;

    var uris = {
        r: "http://62.210.247.11/radio/3093",
        c: "http://oklmtitle.radioking.fr/api/track/cover/"
    };

    var memory = function () {
        if (p) {
            //eve.load();
            //eve.play();
        }
    };

    var play = function () {
        if (!eve) return;

        domElements.cover && domElements.cover.removeClass("fade");
        domElements.pauseBtn && domElements.pauseBtn.show();
        domElements.playBtn && domElements.playBtn.removeClass("pause");

        memory();
        setTimeout(memory, 30 * 60 * 1000);
    };

    var pause = function () {
        if (!eve) return;

        domElements.cover && domElements.cover.addClass("fade");
        domElements.pauseBtn && domElements.pauseBtn.hide();
        domElements.playBtn && domElements.playBtn.addClass("pause");

        eve.pause();
    };

    var playpause = function () {

        p ? pause() : play();
        p = !p;
    };

    var browserIncompatible = function () {
        alert("Votre navigateur est incompatible, veuillez utiliser l'application officielle");
        window.location = "http://www.oklmradio.com/";
    };

    var cleanSearchString = function(str) {
        var low = str.toLowerCase();
        var res = low;

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
            domElements.link.attr("href", data.buy_link);
        }
        else {
            domElements.link.attr("href", null);
        }

        if (data.cover) {
            domElements.cover.attr("src", uris.c + data.cover);
            domElements.coverBg.attr("src", uris.c + data.cover);
        }

        var searchString = cleanSearchString(data.artist) + " " + cleanSearchString(data.title);
        var href = "http://www.deezer.com/search/" + searchString;
        domElements.mosSearch.attr("href", encodeURI(href));
    };

    var jquelink = function () {

        domElements.cover = $("#cover");
        domElements.coverBg = $("#cover-bg");
        domElements.playBtn = $("#cover-resume");
        domElements.pauseBtn = $("#cover-pause");
        domElements.artist = $("#SI-artist");
        domElements.title = $("#SI-title");
        domElements.link = $("#a-buy");
        domElements.slogan = $(".slogan");
        domElements.mosSearch = $("#mos-search");

        domElements.pauseBtn.click(pause);
        domElements.playBtn.click(play);
    };

    var audiolink = function () {
        eve.setAttribute('src', uris.r);
    };

    var addEvents = function () {
        $(document).keypress(function (e) {
            if (e.charCode === 32) {
                playpause();
            }
        });
    };

    var showSlogan = function() {
        var slogans = [
            "Radio pirate",
            "Ecoutez la radio dans le plus grand des calmes",
            "Première sur le Rap",
            "La couronne sur la tête",
            "La premiere fois que t'a cru que t'allais l'entendre, et que tu l'a pas entendu, c'etait sur OKLM.fm",
        ];

        var sId = Math.floor(Math.random() * 1000) % slogans.length;
        var slogan = slogans[sId];

        domElements.slogan.text(slogan);
    };

    var init = function () {

        eve = document.createElement('audio');

        jquelink();

        if (!eve.canPlayType('audio/mpeg')) {
            browserIncompatible();
            return;
        }

        audiolink();

        var socket = io();
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
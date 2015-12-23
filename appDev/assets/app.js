var eve = null;
var domElements = {};
var p = true;

var getRadioUrl = function() {
    var url = "http://62.210.247.11/radio/3093";
    return url;
};

var memory = function() {
    if(p) {
        eve.load();
        eve.play();
    }
};

var play = function() {
    if(!eve) return;

    domElements.cover && domElements.cover.removeClass("fade");
    domElements.pauseBtn && domElements.pauseBtn.show();
    domElements.playBtn && domElements.playBtn.removeClass("pause");

    memory();
    setTimeout(memory, 30 * 60 * 1000);
};

var pause = function() {
    if(!eve) return;

    domElements.cover && domElements.cover.addClass("fade");
    domElements.pauseBtn && domElements.pauseBtn.hide();
    domElements.playBtn && domElements.playBtn.addClass("pause");

    eve.pause();
};

var playpause = function() {

    p ? pause() : play();
    p = !p;
};

var browserIncompatible = function() {
    alert("Votre navigateur est incompatible, veuillez utiliser l'application officielle");
    window.location = "http://www.oklmradio.com/";
};

var updateSonginfo = function(data) {

    domElements.artist.text(data.artist || "");
    domElements.title.text(data.title || "");

    if(data.buy_link) {
        domElements.link.attr("href", data.buy_link);
    }
    else {
        domElements.link.attr("href", null);
    }
};

var jquelink = function() {

    domElements.cover = $("#cover");
    domElements.playBtn = $("#cover-resume");
    domElements.pauseBtn = $("#cover-pause");
    domElements.artist = $("#SI-artist");
    domElements.title = $("#SI-title");
    domElements.link = $("#a-buy");

    domElements.pauseBtn.click(pause);
    domElements.playBtn.click(play);
};

var audiolink = function() {
    eve.setAttribute('src', getRadioUrl());
};

var addEvents = function() {
    $(document).keypress(function(e) {
        if(e.charCode === 32) {
            playpause();
        }
    });
};

var init = function() {

    eve = document.createElement('audio');

    jquelink();

    if (!eve.canPlayType('audio/mpeg')) {
        browserIncompatible();
        return;
    }

    audiolink();

    var socket = io();
    socket.on('songinfo', function(data){
        updateSonginfo(data);
    });

    addEvents();

    play();
};

$( document ).ready( init );

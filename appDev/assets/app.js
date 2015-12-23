var audioComponent = null;
var domElements = {};

var getRadioUrl = function() {
    var url = "http://62.210.247.11/radio/3093";
    return url;
};

var play = function() {
    if(!audioComponent) return;

    domElements.cover && domElements.cover.removeClass("fade");
    domElements.pauseBtn && domElements.pauseBtn.show();
    domElements.playBtn && domElements.playBtn.removeClass("pause");

    audioComponent.load();
    audioComponent.play();

};
var pause = function() {
    if(!audioComponent) return;

    domElements.cover && domElements.cover.addClass("fade");
    domElements.pauseBtn && domElements.pauseBtn.hide();
    domElements.playBtn && domElements.playBtn.addClass("pause");

    audioComponent.pause();
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

var init = function() {

    audioComponent = document.createElement('audio');

    if (!audioComponent.canPlayType('audio/mpeg')) {
        browserIncompatible();
        return;
    }
    domElements.cover = $("#cover");
    domElements.playBtn = $("#cover-resume");
    domElements.pauseBtn = $("#cover-pause");
    domElements.artist = $("#SI-artist");
    domElements.title = $("#SI-title");
    domElements.link = $("#a-buy");

    domElements.pauseBtn.click(pause);
    domElements.playBtn.click(play);

    audioComponent.setAttribute('src', getRadioUrl());


    var socket = io();
    socket.on('songinfo', function(data){
        updateSonginfo(data);
    });

    play();
};

$( document ).ready( init );

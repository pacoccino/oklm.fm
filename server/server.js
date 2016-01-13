var express = require('express'); // Express web server framework
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var expressSession = require('express-session');
var socketio = require('socket.io');
var request = require('request');

var app = express();

var PORT = process.env.PORT || 8888;

app.use(cookieParser());
/*app.use(expressSession({
 secret:'somesecrettokenhere',
 resave: false,
 saveUninitialized: false
 }));*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('app'));

var server = app.listen(PORT);
var io = socketio(server);


var radioId = 3093;
var apiUrl = "http://oklmtitle.radioking.fr/api/radio/" + radioId + "/";

var songState = {
  artist: null,
  title: null
};
var songHistory = [];

var broadcast = function(message, data) {
  io.emit(message, data);
};

var isDifferentSong = function(song1, song2) {
  return (song1.artist !== song2.artist && song1.title !== song2.title);
};

var getLive = function() {
  var url = apiUrl + "track/live";

  var requestObject  = {
    url: url,
    method: "GET",
    json: true
  };

  request(requestObject, function(error, response, body) {
    if (!error && response.statusCode === 200 && body.status === 'success') {

      var song = body.data;
      if(isDifferentSong(songState, song)) {
        songState = song;
        broadcast('songinfo', songState);
        getHistory();
      }
    }
  });
};

var getHistory = function() {
  var limit = 20;
  var url = apiUrl + "track/ckoi?limit="+limit;

  var requestObject  = {
    url: url,
    method: "GET",
    json: true
  };
/*
  var songs = [
    {
      artist: "fok",
      title: "fedok"
    },
    {
      artist: "fok",
      title: "fedok"
    },
    {
      artist: "fok",
      title: "fedok"
    },
    {
      artist: "fok",
      title: "fedok"
    },
    {
      artist: "fok",
      title: "fedok"
    },
    {
      artist: "fok",
      title: "fedok"
    }
  ];
  broadcast('songhistory', songs);

  return;*/

  request(requestObject, function(error, response, body) {
    if (!error && response.statusCode === 200 && body.status === 'success') {

      var songs = body.data;

      if(songHistory.length === 0 || isDifferentSong(songs[0], songHistory[0])) {
        songHistory = songs;
        broadcast('songhistory', songs);
      }
    }
    else {
      console.log("error", error);
    }
  });
};

var updateApi = function() {
  getLive();
  getHistory();
};

io.on('connection', function (socket) {
  socket.emit('songinfo', songState);
  socket.emit('songhistory', songHistory);

});

setInterval(updateApi, 8000);
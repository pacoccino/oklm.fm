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

var broadcast = function(message, data) {
  io.emit(message, data);
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
      if(songState.artist !== song.artist && songState.title !== song.title) {
        songState = song;
        broadcast('songinfo', songState);
        //console.log(songState);
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

var updateApi = function() {
  getLive();
  //getHistory();
};

io.on('connection', function (socket) {
  socket.emit('songinfo', songState);
});

setInterval(updateApi, 8000);
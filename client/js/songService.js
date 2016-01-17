
angularApp.service('songService', ["$window", "$http", function($window, $http) {

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

    var buyLink = function(song, callback) {

        callback && callback(song.buy_link);
        return song.buy_link;
    };
    var itunesLink = buyLink;

    var deezerLink = function(song, callback) {
        var url = "http://www.deezer.com/search/" + getSearchString(song);

        callback && callback(url);
        return url;
    };

    var deezerLinkApi = function(song, callback) {
        var artist = cleanString(song.artist);
        var title = cleanString(song.title);

        artist = artist.replace(/\s/g, '+');
        title = title.replace(/\s/g, '+');


        var search = "artist:\"" + artist + "\"%20track:\"" + artist + "\"";

        var req = {
            url: "https://api.deezer.com/search/track?q=" + search,
            method: 'GET'
        };

        $http(req).then(function(response) {
                            var data = response.data.data;
                            if(data.length === 0) {
                                deezerLink(song, callback);
                                return;
                            }
                            var track = data[0];
                            var trackUrl = track.link;
                            callback(trackUrl);
                        },
                        function(error) {

                        });

        return "http://www.deezer.com";
    };

    var spotifyLink = function(song, callback) {
        var searchString = getSearchString(song);
        searchString = searchString.replace(/\s/g, '+');

        var req = {
            url: "https://api.spotify.com/v1/search?type=track&limit=1&q=" + searchString,
            method: 'GET'
        };

        $http(req).then(function(response) {
                            var tracks = response.data.tracks;
                            if(tracks.total === 0) {
                                callback("");
                                return;
                            }
                            var items = tracks.items;
                            var track = items[0];
                            var trackUri = track.uri;
                            var trackUrl = track.external_urls.spotify;
                            callback(trackUrl);
                        },
                        function(error) {

                        });

        return "http://www.spotify.com";
    };

    var openExternal = function(song, type) {

        var fct = null;
        switch(type) {
            case 'itunes':
                fct = itunesLink;
                break;
            case 'deezer':
                fct = deezerLink;
                break;
            /*case 'spotify':
                fct = spotifyLink;
                break;*/
            default:
                fct = buyLink;
                break;
        }

        fct(song, function(url) {
            $window.open(url, '_blank');
        });
    };

    return {
        deezerLink: deezerLink,
        openExternal: openExternal
    };
}]);
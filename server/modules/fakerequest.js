
var request = function(req, callback) {
    var error = null;

    var response = {
        statusCode: 200
    };

    var body = {
        status: 'success',
        data: {
            artist: "bob"+Math.random(),
            title: "chante"
        }
    };

    callback(error, response, body);
};

module.exports = request;
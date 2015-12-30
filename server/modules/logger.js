var Logger = {
    info: console.log,
    error: console.error,
    silly: console.error,
    verbose: console.log,
    log: function (type, msg) {
        console.log(msg);
    }
};

module.exports = Logger;
var Logger = {
    error: console.error,
    warning: console.log,
    info: console.log,
    silly: console.error,
    verbose: console.log,
    log: function (type, msg) {
        console.log(msg);
    }
};

module.exports = Logger;
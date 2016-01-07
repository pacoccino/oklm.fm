var EventEmitter = require('events').EventEmitter;

var Connector = function() {
    EventEmitter.call(this);
};

Connector.prototype = Object.create(EventEmitter.prototype);

module.exports = function() {
    return new Connector();
};
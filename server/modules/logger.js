'use strict';

const winston = require('winston');
const dateFormat = require('dateformat');

const Config = require('./config');

var dateFilter = function(level, msg, meta) {
    var date = new Date();
    var fmtDate = dateFormat(date, "[dd/mm/yyyy HH:mm:ss]");

    return fmtDate + " " + msg;
};

var Logger = new (winston.Logger)({
    filters: [dateFilter],
    transports: [
        new (winston.transports.Console)({
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'silly-logger',
            filename: `${Config.log.path}/silly-${process.pid}.log`,
            level: 'silly',
            maxsize: 5242880 //5MB
        })
    ]
});

module.exports = Logger;

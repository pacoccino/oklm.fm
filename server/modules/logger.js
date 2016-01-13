'use strict';

const winston = require('winston');
const dateFormat = require('dateformat');
const colors = require('colors/safe');

const Config = require('./config');

var dateFilter = function(level, msg, meta) {
    var date = new Date();
    var fmtDate = dateFormat(date, "[HH:mm:ss]");
    fmtDate = colors.cyan(fmtDate);
    return fmtDate + " " + msg;
};

var Logger = new (winston.Logger)({
    filters: [dateFilter],
    transports: [
        new (winston.transports.Console)({
            level: 'info',
            colorize: true
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

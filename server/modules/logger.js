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
        })
    ]
});

Logger.fileLogByProcessType = function(processType) {

    var filePath = `${Config.log.path}/`;

    if(processType) {
        filePath += `${processType}-`;
    }

    Logger.add(winston.transports.File, {
        name: 'sillyProcessType',
        filename:  filePath + 'silly.log',
        level: 'silly',
        maxsize: 5242880 //5MB
    });
};

Logger.fileLogByLaunchTime = function(processType) {

    var startDate = dateFormat(new Date(), "yyyy.mm.dd-HH.mm.ss");
    var filePath = `${Config.log.path}/${startDate}-`;

    if(processType) {
        filePath += `${processType}-`;
    }

    //filePath += `${process.pid}-`;

    Logger.add(winston.transports.File, {
        name: 'sillyLaunchTime',
        filename:  filePath + 'silly.log',
        level: 'silly',
        maxsize: 5242880 //5MB
    });
};

module.exports = Logger;

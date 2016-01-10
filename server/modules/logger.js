var winston = require('winston');
const Config = require('./config.js');

var Logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'info-file',
            filename: `${Config.logDir}/log-${process.pid}.log`,
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: `${Config.logDir}/error-${process.pid}.log`,
            level: 'error'
        }),
        new (winston.transports.File)({
            name: 'silly-file',
            filename: `${Config.logDir}/silly-${process.pid}.log`,
            level: 'silly'
        })
    ]
});

module.exports = Logger;
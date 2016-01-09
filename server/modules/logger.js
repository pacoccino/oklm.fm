var winston = require('winston');

var Logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'info-file',
            filename: 'logs/log.log',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: 'logs/error.log',
            level: 'error'
        }),
        new (winston.transports.File)({
            name: 'silly-file',
            filename: 'logs/silly'+process.pid+'.log',
            level: 'silly'
        })
    ]
});

module.exports = Logger;
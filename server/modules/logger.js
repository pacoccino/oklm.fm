const winston = require('winston');
const Config = require('./config');

var Logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'info-file',
            filename: `${Config.log.path}/log-${process.pid}.log`,
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: `${Config.log.path}/error-${process.pid}.log`,
            level: 'error'
        }),
        new (winston.transports.File)({
            name: 'silly-file',
            filename: `${Config.log.path}/silly-${process.pid}.log`,
            level: 'silly'
        })
    ]
});

module.exports = Logger;
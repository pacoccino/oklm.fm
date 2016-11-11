'use strict';

const express = require('express');
const http = require('http');
const compression = require('compression');

const Logger = require('../modules/logger');
const Config = require('../modules/config');

const WebServer = {};

WebServer.app = express();

WebServer.initExpress = function(config) {
    const app = WebServer.app;

    config = config || {
            port: 3000
        };

    app.set('port', config.port);

    app.server = http.createServer(app);
};

WebServer.listen = function() {
    const app = WebServer.app;
    app.server.listen(app.get('port'), () => {
        Logger.info(`Server listen on ${app.get('port')}`);
    });
};

WebServer.static = function() {
    const app = WebServer.app;

    app.use(compression());
    app.use(express.static(Config.static.publicFolder, { maxAge: Config.static.cache })); // TODO morgan-logger
};

module.exports = WebServer;



'use strict';

const express = require('express');
const http = require('http');
const compression = require('compression');

const Logger = require('../modules/logger');
const Config = require('../modules/config');

var WebServer = {};

const app = express();

WebServer.launch = function() {

    app.set('port', Config.static.port);

    app.use(compression());

    app.use(express.static(Config.static.publicFolder, { maxAge: Config.static.cache })); // TODO morgan-logger

    app.server = http.createServer(app);

    app.server.listen(app.get('port'), () => {

        Logger.info(`Static server listen on ${app.get('port')}`);

    });
};

module.exports = WebServer;



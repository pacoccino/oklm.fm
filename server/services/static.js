'use strict';

const express = require('express');
const http = require('http');

const Logger = require('../modules/logger');
const Config = require('../modules/config');
const app = express();

app.set('port', Config.static.port);

app.use( (req, res, next) => {
  
  Logger.silly(`New connection on process api ${process.pid}`);
  next();
  
});

app.use(express.static(Config.static.publicFolder)); // TODO morgan-logger

app.server = http.createServer(app);

app.server.listen(app.get('port'), () => {
  
  Logger.info(`Server listen on ${app.get('port')}`);
  
});


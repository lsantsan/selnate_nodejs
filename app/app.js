'use strict';

const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const apiRouter = require('./api/api');
const dbConnection = require('../config/db/db.connection');
const logger = require('./../config/logger/logger.config');

const app = express();
const APP_READY_EVENT = 'app_ready';

const createApp = function (config) {
    logger.info('Creating app...');

    //Setting up app's basic info
    app.set('env', config.env);
    app.set('host', config.server.host);
    app.set('port', config.server.port);

    //Setting up middleware
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(morgan('combined', {stream: logger.stream}));

    //Setting up routes
    app.use('/api', apiRouter);
};

const startConnections = function (config) {
    logger.info('Starting connections...');
    //MongoDb connection
    const dbPromise = dbConnection.connect(config.db);

    Promise.all([dbPromise])
        .then(() => {
            logger.info('All connections are established.');
            app.emit(APP_READY_EVENT);
        })
        .catch(reason => {
            logger.error('Error while starting connections.');
            logger.logAndExit('error', reason, 1); //exitCode=1
        });
};

const startApp = function () {
    logger.info('Starting app...');
    const host = app.get('host');
    const port = app.get('port');
    const message = util.format('Server listening on: http://%s:%s', host, port);

    app.on(APP_READY_EVENT, function () {
        app.listen(port, function () {
            logger.info(message);
        });
    });
};

const start = function (config) {
    createApp(config);
    startConnections(config);
    startApp();
};

module.exports = {
    start: start
};

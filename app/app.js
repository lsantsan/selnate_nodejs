'use strict';

var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./api/api');

var app = express();

var create = function (config) {
    //Setting up app's basic info
    app.set('env', config.env);
    app.set('host', config.server.host);
    app.set('port', config.server.port);

    //Setting up middleware
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    //Setting up routes
    app.use('/api', apiRouter);
};

var start = function () {
    var host = app.get('host');
    var port = app.get('port');
    var message = util.format('Server listening on: http://%s:%s', host, port);

    app.listen(port, function () {
       console.log(message);
    });
};

module.exports = {
    create: create,
    start: start
};

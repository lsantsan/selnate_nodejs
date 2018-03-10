var express = require('express');
var app = express();
var db = require('../config/db');

var apiRouter = require('./api');
app.use('/api', apiRouter);

module.exports = app;
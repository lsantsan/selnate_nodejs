'use strict';

var config = require('./config/config');
var app = require('./app/app');

app.create(config);
app.start();
'use strict';

const argv = require('minimist')(process.argv.slice(2));
const dbConfig = require('./db/db.config');
const serverConfig = require('./server/server.config');

const ENV = argv.env;
if (!ENV) throw new Error('Argument \'env\' not found. i.e --env=dev');

var db = dbConfig.get(ENV);
var server = serverConfig.get(ENV);

var config = {
    env: ENV,
    server: server,
    db: db
};

module.exports = config;
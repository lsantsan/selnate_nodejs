'use strict';

const argv = require('minimist')(process.argv.slice(2));
const dbConfig = require('./db/db.config');
const serverConfig = require('./server/server.config');

const ENV = argv.env;
if (!ENV) throw new Error('Argument \'env\' not found. i.e --env=dev');

//Config Resources
const db = dbConfig.get(ENV);
const server = serverConfig.get(ENV);

//Gathering configs
const config = {
    env: ENV,
    server: server,
    db: db
};

module.exports = config;
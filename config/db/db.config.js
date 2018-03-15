'use strict';

const util = require('util');

const config = {
    dev: {
        requiredEnvVariables: [],
        username: 'selnateUser',
        password: 'cangetin',
        host: '127.0.0.1',
        port: '27017',
        dbName: 'selnate'
    },
    prod: {
        requiredEnvVariables: ['NODE_DB_PASSWORD'],
        username: 'selnateUser',
        password: process.env.NODE_DB_PASSWORD,
        host: '127.0.0.1',
        port: '27017',
        dbName: 'selnate'
    }
};

const get = function (ENV) {
    const dbConfig = config[ENV];
    if (!dbConfig) throw new Error(util.format('[DB CONFIG] Environment \'%s\' not found in the db config file.', ENV));

    dbConfig.requiredEnvVariables.forEach(function (varName) {
        if (!process.env[varName]) throw new Error(util.format('[DB CONFIG] Environment variable \'%s\' not found on this host for \'%s\' environment.', varName, ENV));
    });

    return dbConfig;
};

module.exports = {
    get: get
};
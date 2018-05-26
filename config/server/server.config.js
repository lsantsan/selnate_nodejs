'use strict';

const util = require('util');

const config = {
    dev: {
        requiredEnvVariables: [],
        port: '3000',
        host: '127.0.0.1',
        jwtSecret: 'cangetin'
    },
    prod: {
        requiredEnvVariables: ['NODE_JWT_SECRET'],
        port: '3000',
        host: '127.0.0.1',
        jwtSecret: process.env.NODE_JWT_SECRET
    }
};

//Refactor: create a config class
const get = function (ENV) {
    const serverConfig = config[ENV];
    if (!serverConfig) throw new Error(util.format('[SERVER CONFIG] Environment \'%s\' not found in the server config file.', ENV));

    serverConfig.requiredEnvVariables.forEach(function (varName) {
        if (!process.env[varName]) throw new Error(util.format('[SERVER CONFIG] Environment variable \'%s\' not found on this host for \'%s\' environment.', varName, ENV));
    });

    return serverConfig;
};

module.exports = {
    get: get
};
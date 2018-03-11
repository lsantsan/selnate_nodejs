'use strict';

module.exports = {
    dev: {
        requiredEnvVariables: [],
        username: 'selnateUser',
        password: 'cangetin',
        host: '127.0.0.1',
        port: '27017'
    },
    prod: {
        requiredEnvVariables: ['NODE_DB_PASSWORD'],
        username: 'selnateUser',
        password: process.env.NODE_DB_PASSWORD,
        host: '127.0.0.1',
        port: '27017'
    }
};
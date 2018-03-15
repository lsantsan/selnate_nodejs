'use strict';

const util = require('util');
const mongoose = require('mongoose');
const logger = require('./../logger/logger.config');


const connect = function (dbConfig) {
    const username = dbConfig.username;
    const password = dbConfig.password;
    const host = dbConfig.host;
    const dbPort = dbConfig.port;
    const dbName = dbConfig.dbName;
    const uri = util.format('mongodb://%s:%s@%s:%s/%s', username, password, host, dbPort, dbName);

    return new Promise((resolve, reject) => {
        logger.info('Connecting to MongoDb...');
        mongoose.connect(uri)
            .then(() => {
                resolve(true)
            })
            .catch(reason => {
                reject(reason)
            });

    });
};

// If the connection throws an error
/*mongoose.connection.on('error', function (err) {
    logger.error('error EVENT HAPPENED!');
    logger.error(err);
});*/

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    logger.info('Database is disconnected.');
});

module.exports = {
    connect: connect
};
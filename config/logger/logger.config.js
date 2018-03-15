'use strict';

const argv = require('minimist')(process.argv.slice(2));
const winston = require('winston');
require('winston-log-and-exit');
const appRoot = require('app-root-path');

const ENV = argv.env;

const options = {
    dev: {
        console: {
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: () => new Date().toLocaleString()
        }
    },
    prod: {
        file: {
            level: 'info',
            filename: `${appRoot}/logs/app.log`,
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            colorize: false,
            timestamp: () => new Date().toLocaleString()
        }
    }
};

const loggerOptions = options[ENV];
let logger = null;
switch (ENV) {
    case 'dev':
        logger = new winston.Logger({
            transports: [
                new winston.transports.Console(loggerOptions.console)
            ],
            exitOnError: false
        });
        break;
    case 'prod':
        logger = new winston.Logger({
            transports: [
                new winston.transports.File(loggerOptions.file)
            ],
            exitOnError: false
        });
        break;
    default:
        logger = new winston.Logger({
            transports: [
                new winston.transports.Console(loggerOptions.console)
            ],
            exitOnError: false
        });
}

logger.stream = {
    write: function (message) {
        logger.info(message);
    }
};

module.exports = logger;
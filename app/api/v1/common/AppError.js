'use strict';

const HttpStatus = require('http-status-codes');
const AppStatus = require('./../common/app-status');
const ErrorMessage = require('../common/ErrorMessage');
const Result = require('../common/Result');

class AppError {

    static throwError(errorName, logMessage) {
        const error = new Error(logMessage);
        error.name = errorName;
        throw error;
    }

    static handleGenericError() {
        const body = new ErrorMessage(AppStatus.INTERNAL_ERROR, AppStatus.getStatusText(AppStatus.INTERNAL_ERROR), {
            message: 'Something went wrong. Please look at the logs.'
        });

        return new Result(HttpStatus.INTERNAL_SERVER_ERROR, body);
    }
}

module.exports = AppError;
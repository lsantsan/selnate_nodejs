'use strict';

/* eslint-disable callback-return */
/* eslint-disable consistent-return */

const appRequire = require('app-root-path').require;
const logger = appRequire('/config/logger/logger.config');
const jwt = require('jsonwebtoken');
const AppError = require('./../common/AppError');
const _$ = require('./../common/constants');
const ErrorMessage = require('../common/ErrorMessage');
const AppStatus = require('./../common/app-status');
const HttpStatus = require('http-status-codes');
const Result = require('../common/Result');

function handleTokenError(error) {
    const body = new ErrorMessage(AppStatus.TOKEN_NOT_FOUND, AppStatus.getStatusText(AppStatus.TOKEN_NOT_FOUND), {
        name: error.name,
        message: error.message
    });

    return new Result(HttpStatus.UNAUTHORIZED, body);
}

function handleTokenExpiredError(error) {
    const body = new ErrorMessage(AppStatus.TOKEN_EXPIRED, AppStatus.getStatusText(AppStatus.TOKEN_EXPIRED), {
        name: error.name,
        message: 'Token has expired. Please login again.'
    });

    return new Result(HttpStatus.UNAUTHORIZED, body);
}

function handleErrors(error) {
    switch (error.name) {
        case _$.TOKEN_ERROR: {
            return handleTokenError(error);
        }
        case _$.TOKEN_EXPIRED_ERROR: {
            return handleTokenExpiredError(error);
        }
        default:
            return AppError.handleGenericError();
    }
}

async function verifyToken(req, res, next) {
    try {
        const jwtSecret = req.app.get('jwtSecret');
        const token = req.headers['x-access-token'];

        if (!jwtSecret) AppError.throwError(_$.APP_ERROR, 'Jwt secret not found.');

        if (!token) AppError.throwError(_$.TOKEN_ERROR, 'Request does not have token.');

        const decoded = await jwt.verify(token, jwtSecret); //2 hours
        if (!decoded) AppError.throwError(_$.APP_ERROR, 'Decoded info is null.');

        req.consumerId = decoded.id;
    }
    catch (error) {
        logger.error(error);
        const result = handleErrors(error);

        return res.status(result.status)
            .send(result.body);
    }
    next();

}

module.exports = verifyToken;
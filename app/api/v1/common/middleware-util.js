'use strict';

/* eslint-disable no-extra-parens */
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
const TeacherModel = require('../teachers/teachers.model');

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
        message: error.message
    });

    return new Result(HttpStatus.UNAUTHORIZED, body);
}

function handleConsumeForbiddenError(error) {
    const body = new ErrorMessage(AppStatus.CONSUMER_FORBIDDEN, AppStatus.getStatusText(AppStatus.CONSUMER_FORBIDDEN), {
        name: error.name,
        message: error.message
    });

    return new Result(HttpStatus.FORBIDDEN, body);
}

function handleErrors(error) {
    logger.error(error);
    switch (error.name) {
        case _$.TOKEN_ERROR: {
            return handleTokenError(error);
        }
        case _$.TOKEN_EXPIRED_ERROR: {
            return handleTokenExpiredError(error);
        }
        case _$.CONSUMER_FORBIDDEN_ERROR: {
            return handleConsumeForbiddenError(error);
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
    } catch (error) {
        const result = handleErrors(error);

        return res.status(result.status)
            .send(result.body);
    }
    next();
}

function isConsumerValidTeacher(req) {
    const consumerId = req.consumerId;
    const teacherId = req.params.id;

    return (consumerId === teacherId);
}

async function isConsumerAdmin(req) {
    const consumerId = req.consumerId;
    const searchCriteria = {
        _id: consumerId,
        isActive: true
    };
    const consumer = await TeacherModel.findOne(searchCriteria);

    return (consumer && consumer.isAdmin);
}

function checkRole(...allowedRoles) {
    return async (req, res, next) => {
        try {
            const consumerRoles = [];
            let isAuthorized = false;

            if (await isConsumerAdmin(req)) consumerRoles.push(_$.ROLES.ADMIN);
            if (isConsumerValidTeacher(req)) consumerRoles.push(_$.ROLES.TEACHER);

            consumerRoles.forEach(consumerRole => {
                if (allowedRoles.indexOf(consumerRole) > -1) isAuthorized = true;
            });

            if (isAuthorized) {
                return next();
            }
            const consumerId = req.consumerId;
            AppError.throwError(_$.CONSUMER_FORBIDDEN_ERROR, `ConsumerId=${consumerId} does not have any of the following roles=${allowedRoles}`);


        } catch (error) {
            const result = handleErrors(error);
            res.status(result.status)
                .send(result.body);
        }
    }


}

module.exports = {
    verifyToken: verifyToken,
    checkRole: checkRole
};

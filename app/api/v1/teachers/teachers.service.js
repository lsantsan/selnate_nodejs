'use strict';

const appRequire = require('app-root-path').require;
const logger = appRequire('/config/logger/logger.config');
const bcrypt = require('bcryptjs');
const HttpStatus = require('http-status-codes');
const AppStatus = require('./../common/app-status');
const _$ = require('./../common/constants');
const TeacherModel = require('./teachers.model');
const ErrorMessage = require('./../common/error-message.class');
const Result = require('./../common/result.class');

function handleValidationError(error) {
    const body = new ErrorMessage(AppStatus.TEACHER_NOT_CREATED, AppStatus.getStatusText(AppStatus.TEACHER_NOT_CREATED), {
        name: error.name,
        message: error.message
    });

    return new Result(HttpStatus.BAD_REQUEST, body);
}

function handleGenericError(error) {
    const body = new ErrorMessage(AppStatus.INTERNAL_ERROR, AppStatus.getStatusText(AppStatus.INTERNAL_ERROR), error);

    return new Result(HttpStatus.INTERNAL_SERVER_ERROR, body);
}

function handleMongoError(error) {
    switch (error.code) {
        case _$.MONGO_11000: {
            const body = new ErrorMessage(AppStatus.DUPLICATE_TEACHER_USERNAME, AppStatus.getStatusText(AppStatus.DUPLICATE_TEACHER_USERNAME), {
                name: error.name,
                message: error.errmsg
            });

            return new Result(HttpStatus.BAD_REQUEST, body);
        }
        default:
            return handleGenericError(error);
    }
}

function handleErrors(error) {
    switch (error.name) {
        case _$.VALIDATION_ERROR:
            return handleValidationError(error);
        case _$.MONGO_ERROR:
            return handleMongoError(error);
        default:
            return handleGenericError(error);
    }
}

const post = async function (request) {
    let result = new Result();

    try {
        request.password = await bcrypt.hash(request.password, _$.SALT);
        const body = await TeacherModel.create(request);
        Reflect.deleteProperty(body._doc, 'password');
        result.status = HttpStatus.OK;
        result.body = body;
    }
    catch (error) {
        logger.error(error);
        result = handleErrors(error);
    }

    return result;
};

module.exports = {
    post: post
};







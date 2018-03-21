'use strict';

const appRequire = require('app-root-path').require;
const logger = appRequire('/config/logger/logger.config');
const TeacherModel = require('./teachers.model');
const ErrorMessage = require('./../common/error-message.class');
const Result = require('./../common/result.class');

function handleValidationError(error) {
    const body = new ErrorMessage('APP-100', 'Teacher not created.', {
        name: error.name,
        message: error.message
    });

    return new Result(400, body);
}

function handleGenericError(error) {
    const body = new ErrorMessage('APP-999', 'Internal error.', error);

    return new Result(500, body);
}

const post = async function (request) {
    let result = new Result();

    try {
        const body = await TeacherModel.create(request);
        result.status = 200;
        result.body = body;
    }
    catch (error) {
        logger.error(error);
        if (error.name === 'ValidationError') {
            result = handleValidationError(error);
        } else {
            result = handleGenericError(error);
        }
    }

    return result;
};

module.exports = {
    post: post
};







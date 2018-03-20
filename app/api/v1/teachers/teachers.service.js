'use strict';

const appRequire = require('app-root-path').require;
const logger = appRequire('/config/logger/logger.config');
const TeacherModel = require('./teachers.model');
const ErrorMessage = require('./../common/error-message.class');
const Result = require('./../common/result.class');

function handleValidationError(reason) {
    const body = new ErrorMessage('APP-100', 'Teacher not created.', {
        name: reason.name,
        message: reason.message
    });

    return new Result(400, body);
}

const post = async function (request) {
    let result = new Result();

    try {
        const body = await TeacherModel.create(request);
        result.status = 200;
        result.body = body;
    }
    catch (reason) {
        logger.error(reason);
        if (reason.name === 'ValidationError') {
            result = handleValidationError(reason);
        }
    }

    return result;
};

module.exports = {
    post: post
};







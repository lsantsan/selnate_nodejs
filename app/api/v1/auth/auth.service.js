'use strict';

const appRequire = require('app-root-path').require;
const logger = appRequire('/config/logger/logger.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const AppStatus = require('./../common/app-status');
const _$ = require('./../common/constants');
const TeacherModel = require('./../teachers/teachers.model');
const ErrorMessage = require('./../common/error-message.class');
const Result = require('./../common/result.class');

function handleLoginError() {
    const body = new ErrorMessage(
        AppStatus.LOGIN_NOT_VALID,
        AppStatus.getStatusText(AppStatus.LOGIN_NOT_VALID),
        null
    );

    return new Result(HttpStatus.UNAUTHORIZED, body);
}

function handleGenericError(error) {
    const body = new ErrorMessage(AppStatus.INTERNAL_ERROR, AppStatus.getStatusText(AppStatus.INTERNAL_ERROR), error);

    return new Result(HttpStatus.INTERNAL_SERVER_ERROR, body);
}

function handleErrors(error) {
    switch (error.name) {
        case _$.LOGIN_ERROR:
            return handleLoginError();
        default:
            return handleGenericError(error);
    }
}

function throwLoginError(logMessage) {
    const error = new Error(logMessage);
    error.name = _$.LOGIN_ERROR;
    throw error;
}

const post = async function (request, jwtSecret) {
    let result = new Result();
    const username = request.username;
    const password = request.password;

    try {
        const teacher = await TeacherModel.findOne({
            username: username
        }).select('+password');
        if (!teacher) throwLoginError(AppStatus.getStatusText(AppStatus.TEACHER_NOT_FOUND));

        const isPasswordValid = await bcrypt.compare(password, teacher.password);
        if (!isPasswordValid) throwLoginError(AppStatus.getStatusText(AppStatus.PASSWORD_NOT_VALID));

        const token = await jwt.sign({id: teacher._id}, jwtSecret, {expiresIn: 7200}); //2 hours

        result.status = HttpStatus.OK;
        result.body = {
            auth: true,
            token: token
        };

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







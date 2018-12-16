'use strict';

const appRequire = require('app-root-path').require;
const logger = appRequire('/config/logger/logger.config');
const bcrypt = require('bcryptjs');
const HttpStatus = require('http-status-codes');
const AppStatus = require('./../common/app-status');
const _$ = require('./../common/constants');
const TeacherModel = require('./teachers.model');
const ErrorMessage = require('../common/ErrorMessage');
const Result = require('../common/Result');
const AppError = require('./../common/AppError');

function handleValidationError(error) {
    const body = new ErrorMessage(AppStatus.TEACHER_NOT_CREATED, AppStatus.getStatusText(AppStatus.TEACHER_NOT_CREATED), {
        name: error.name,
        message: error.message
    });

    return new Result(HttpStatus.BAD_REQUEST, body);
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
            return AppError.handleGenericError();
    }
}

function handleErrors(error) {
    logger.error(error);
    switch (error.name) {
        case _$.VALIDATION_ERROR:
            return handleValidationError(error);
        case _$.MONGO_ERROR:
            return handleMongoError(error);
        default:
            return AppError.handleGenericError();
    }
}

const post = async function (request, consumerId) {
    let result = new Result();

    try {
        request.password = await bcrypt.hash(request.password, _$.SALT);
        request._updatedBy = consumerId;

        const body = await TeacherModel.create(request);
        Reflect.deleteProperty(body._doc, 'password');

        result.status = HttpStatus.OK;
        result.body = body;
    }
    catch (error) {
        result = handleErrors(error);
    }

    return result;
};

const getAll = async function () {
    let result = new Result();

    try {
        const teachers = await TeacherModel.find({isActive: true});
        result.status = HttpStatus.OK;
        result.body = teachers;

    } catch (error) {
        result = handleErrors(error);
    }

    return result;
};

const getById = async function (id) {
    let result = new Result();

    try {
        const teacher = await TeacherModel.findOne({
            _id: id,
            isActive: true
        });

        if (!teacher) {
            result.status = HttpStatus.NOT_FOUND;
            result.body = new ErrorMessage(
                AppStatus.TEACHER_NOT_FOUND,
                AppStatus.getStatusText(AppStatus.TEACHER_NOT_FOUND),
                {_id: id}
            );

            return result;
        }
        result.status = HttpStatus.OK;
        result.body = teacher;

    } catch (error) {
        result = handleErrors(error);
    }

    return result;
};

module.exports = {
    post: post,
    getAll: getAll,
    getById: getById
};







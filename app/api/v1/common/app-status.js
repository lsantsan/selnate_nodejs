'use strict';

/* eslint-disable no-prototype-builtins */

const statusCodes = {};

statusCodes[exports.TEACHER_NOT_CREATED = 'APP-100'] = 'Teacher not created.';
statusCodes[exports.DUPLICATE_TEACHER_USERNAME = 'APP-101'] = 'Teacher username already exists.';
statusCodes[exports.TEACHER_NOT_FOUND = 'APP-102'] = 'Teacher not found.';
statusCodes[exports.PASSWORD_NOT_VALID = 'APP-103'] = 'Password not valid.';
statusCodes[exports.LOGIN_NOT_VALID = 'APP-104'] = 'Login not valid.';
statusCodes[exports.TOKEN_NOT_FOUND = 'APP-105'] = 'Token not found.';
statusCodes[exports.TOKEN_EXPIRED = 'APP-106'] = 'Token has expired.';
statusCodes[exports.INTERNAL_ERROR = 'APP-999'] = 'Internal error.';


exports.getStatusText = function (statusCode) {
    return statusCodes[statusCode];
};
'use strict';

/* eslint-disable no-prototype-builtins */

const statusCodes = {};

statusCodes[exports.TEACHER_NOT_CREATED = 'APP-100'] = 'Teacher not created.';
statusCodes[exports.DUPLICATE_TEACHER_USERNAME = 'APP-101'] = 'Teacher username already exists.';
statusCodes[exports.INTERNAL_ERROR = 'APP-999'] = 'Internal error.';


exports.getStatusText = function (statusCode) {
    return statusCodes[statusCode];
};
'use strict';

module.exports = Object.freeze({
    ROLES: {
        TEACHER: 'teacher',
        ADMIN: 'admin'
    },

    APP_ERROR: 'AppError',
    CONSUMER_NOT_FOUND_ERROR: 'ConsumerNotFoundError',
    CONSUMER_FORBIDDEN_ERROR: 'ConsumerForbiddenError',
    LOGIN_ERROR: 'LoginError',
    MONGO_ERROR: 'BulkWriteError',
    TOKEN_ERROR: 'TokenError',
    TOKEN_EXPIRED_ERROR: 'TokenExpiredError',
    VALIDATION_ERROR: 'ValidationError',

    MONGO_11000: 11000,
    SALT: 10,

    GENERIC_ERROR_MESSAGE: 'Something went wrong. Please look at the logs.'
});

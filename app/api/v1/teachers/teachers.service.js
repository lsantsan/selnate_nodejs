'use strict';

//const TeacherModel = require('./teachers.model');

const post = function (request) {
    const result = request;
    result.id = 123;

    return result;
};

module.exports = {
    post: post
};







'use strict';

module.exports = class ErrorMesage {

    constructor(code, message, detail) {
        this.code = code;
        this.message = message;
        this.detail = detail;
    }
};
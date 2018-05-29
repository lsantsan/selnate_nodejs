'use strict';

class ErrorMessage {

    constructor(code, message, detail) {
        this.code = code;
        this.message = message;
        this.detail = detail;
    }

    toString() {
        return `(${this.code}, ${this.message}, ${this.detail})`;
    }
}

module.exports = ErrorMessage;
'use strict';

const DEFAULT_STATUS = 500;
const DEFAULT_BODY = 'Default Body';

class Result {

    constructor(status, body) {
        if (!arguments.length) {
            this.status = DEFAULT_STATUS;
            this.body = DEFAULT_BODY;
        } else {
            this.status = status;
            this.body = body;
        }
    }
}

module.exports = Result;

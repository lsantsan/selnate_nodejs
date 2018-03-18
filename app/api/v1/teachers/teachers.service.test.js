const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const teacherService = require('./teachers.service');

describe('Teacher Service', function () {
    describe('Post', function () {
        it('should create a new teacher', function () {
            const req = {
                firstName: 'Teacher1',
                lastName: 'LastName1'
            };

            const result = teacherService.post(req);

            assert.isObject(result, 'result is not an object');
            expect(result).to.have.property('id');
        });
    });

});

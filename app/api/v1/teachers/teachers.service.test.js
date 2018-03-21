'use strict';

/* eslint-disable max-statements */

const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon').createSandbox();
const teacherService = require('./teachers.service');
const TeacherModel = require('./teachers.model');
const Result = require('./../common/result.class');
const ErrorMessage = require('./../common/error-message.class');
const Logger = require('../../../../config/logger/logger.config');

describe('Teacher Service', function () {

    describe('Post', function () {
        let teacherModelMock = null;
        let loggerMock = null;

        const validRequest = {
            firstName: 'firstName1',
            lastName: 'lastName1',
            username: 'myusername',
            password: 'P@$$w0rd',
            isAdmin: true,
            isActive: true
        };

        beforeEach(() => {
            teacherModelMock = sinon.mock(TeacherModel);
            loggerMock = sinon.mock(Logger);
        });
        afterEach(() => {
            sinon.restore();
        });

        it('should create a new teacher', async () => {
            //GIVEN
            const input = validRequest;

            const dbResult = input;
            dbResult._id = 'adsftrw1234';

            const expectedResult = new Result(200, dbResult);

            //mocks
            teacherModelMock.expects('create')
                .once()
                .withExactArgs(input)
                .resolves(dbResult);

            //WHEN
            const result = await teacherService.post(input);

            //THEN
            teacherModelMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult)
        });

        it('should return validation error', async () => {
            //GIVEN
            const ERROR_CODE = 'APP-100';
            const ERROR_MESSAGE = 'Teacher not created.';

            const req = validRequest;

            const dbResult = {
                name: 'ValidationError',
                message: 'This a validation _message.'
            };

            const expectedResult = new Result(400, new ErrorMessage(ERROR_CODE, ERROR_MESSAGE, dbResult));

            //mocks
            teacherModelMock.expects('create')
                .once()
                .withExactArgs(req)
                .rejects(dbResult);

            loggerMock.expects('error')
                .once()
                .withExactArgs(dbResult)
                .resolves();

            //WHEN
            const result = await teacherService.post(req);

            //THEN
            teacherModelMock.verify();
            loggerMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult)
        });
    });

});

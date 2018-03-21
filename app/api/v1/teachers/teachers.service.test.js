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

        it('should handle validation error', async () => {
            //GIVEN
            const req = validRequest;

            const dbError = {
                name: 'ValidationError',
                message: 'This a validation _message.'
            };

            const ERROR_CODE = 'APP-100';
            const ERROR_MESSAGE = 'Teacher not created.';
            const expectedResult = new Result(400, new ErrorMessage(ERROR_CODE, ERROR_MESSAGE, dbError));

            //mocks
            teacherModelMock.expects('create')
                .once()
                .withExactArgs(req)
                .rejects(dbError);

            loggerMock.expects('error')
                .once()
                .withExactArgs(dbError)
                .resolves();

            //WHEN
            const result = await teacherService.post(req);

            //THEN
            teacherModelMock.verify();
            loggerMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult)
        });

        it('should handle generic error', async () => {
            //GIVEN
            const req = validRequest;

            const dbError = {
                name: 'MongoError',
                err: 'E11000 duplicate key error index: ussdauto.operators.$name_1  dup key: { : \\"OpTest\\" }',
                code: '11000'
            };

            const ERROR_CODE = 'APP-999';
            const ERROR_MESSAGE = 'Internal error.';
            const expectedResult = new Result(500, new ErrorMessage(ERROR_CODE, ERROR_MESSAGE, dbError));

            //mock
            teacherModelMock.expects('create')
                .once()
                .withExactArgs(req)
                .rejects(dbError);

            loggerMock.expects('error')
                .once()
                .withExactArgs(dbError)
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

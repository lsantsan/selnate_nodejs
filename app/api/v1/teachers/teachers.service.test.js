/* eslint-disable max-lines */

'use strict';


const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon').createSandbox();
const bcrypt = require('bcryptjs');
const HttpStatus = require('http-status-codes');
const AppStatus = require('./../common/app-status');
const _$ = require('./../common/constants');
const teacherService = require('./teachers.service');
const TeacherModel = require('./teachers.model');
const Result = require('../common/Result');
const ErrorMessage = require('../common/ErrorMessage');
const Logger = require('../../../../config/logger/logger.config');

describe('Teacher Service', function () {
    const validTeacher = {
        firstName: 'firstName1',
        lastName: 'lastName1',
        username: 'myusername',
        password: 'P@$$w0rd',
        isAdmin: true,
        isActive: true
    };

    let teacherModelMock = null;
    let loggerMock = null;
    let bcryptMock = null;

    beforeEach(() => {
        teacherModelMock = sinon.mock(TeacherModel);
        loggerMock = sinon.mock(Logger);
        bcryptMock = sinon.mock(bcrypt);
    });
    afterEach(() => {
        sinon.restore();
    });

    describe('Post', function () {

        it('should create a new teacher', async () => {
            //GIVEN
            const input = validTeacher;
            const consumerId = 'bacwe1234rty';
            const teacherObject = Object.assign({}, input);
            teacherObject.password = await bcrypt.hash(teacherObject.password, _$.SALT);
            teacherObject._updatedBy = consumerId;

            const dbResult = Object.assign({}, input);
            dbResult._id = '123342412';
            Reflect.deleteProperty(dbResult, 'password');
            dbResult._doc = dbResult;

            const expectedResult = new Result(HttpStatus.OK, dbResult);

            //mocks
            bcryptMock.expects('hash')
                .once()
                .withExactArgs(input.password, _$.SALT)
                .resolves(teacherObject.password);

            teacherModelMock.expects('create')
                .once()
                .withExactArgs(teacherObject)
                .resolves(dbResult);

            //WHEN
            const result = await teacherService.post(input, consumerId);

            //THEN
            bcryptMock.verify();
            teacherModelMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult);
        });

        it('should handle validation error', async () => {
            //GIVEN
            const req = validTeacher;

            const dbError = {
                name: _$.VALIDATION_ERROR,
                message: 'This a validation _message.'
            };

            const expectedResult = new Result(
                HttpStatus.BAD_REQUEST,
                new ErrorMessage(
                    AppStatus.TEACHER_NOT_CREATED,
                    AppStatus.getStatusText(AppStatus.TEACHER_NOT_CREATED),
                    dbError
                )
            );

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
            assert.deepEqual(result, expectedResult);
        });

        it('should handle generic error', async () => {
            //GIVEN
            const req = validTeacher;

            const dbError = {
                name: 'GenericError',
                err: 'This is a generic error message',
                code: 12345
            };

            const expectedResult = new Result(
                HttpStatus.INTERNAL_SERVER_ERROR,
                new ErrorMessage(
                    AppStatus.INTERNAL_ERROR,
                    AppStatus.getStatusText(AppStatus.INTERNAL_ERROR),
                    {message: _$.GENERIC_ERROR_MESSAGE}
                )
            );

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
            assert.deepEqual(result, expectedResult);

        });

        it('should handle generic MongoDb error', async () => {
            //GIVEN
            const req = validTeacher;

            const dbError = {
                name: _$.MONGO_ERROR,
                err: 'This is a generic MongoDb error message',
                code: 12345
            };

            const expectedResult = new Result(
                HttpStatus.INTERNAL_SERVER_ERROR,
                new ErrorMessage(
                    AppStatus.INTERNAL_ERROR,
                    AppStatus.getStatusText(AppStatus.INTERNAL_ERROR),
                    {message: _$.GENERIC_ERROR_MESSAGE}
                )
            );

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
            assert.deepEqual(result, expectedResult);

        });

        it('should handle duplicate username error', async () => {
            //GIVEN
            const req = validTeacher;

            const dbError = {
                name: _$.MONGO_ERROR,
                errmsg: 'E11000 duplicate key error index: ussdauto.operators.$name_1  dup key: { : \\"OpTest\\" }',
                code: _$.MONGO_11000
            };

            const expectedResult = new Result(
                HttpStatus.BAD_REQUEST,
                new ErrorMessage(
                    AppStatus.DUPLICATE_TEACHER_USERNAME,
                    AppStatus.getStatusText(AppStatus.DUPLICATE_TEACHER_USERNAME),
                    {
                        name: dbError.name,
                        message: dbError.errmsg
                    }
                )
            );

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
            assert.deepEqual(result, expectedResult);
        });
    });

    describe('Get All', () => {
        it('should return a list of all teachers', async () => {
            //GIVEN
            const findAllCriteria = {isActive: true};

            //mock
            teacherModelMock.expects('find')
                .once()
                .withExactArgs(findAllCriteria)
                .resolves([validTeacher, validTeacher]);

            const expectedResult = new Result(HttpStatus.OK, [validTeacher, validTeacher]);

            //WHEN
            const result = await teacherService.getAll();

            //THEN
            teacherModelMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult);
        });

        it('should handle generic error', async () => {
            //GIVEN
            const findAllCriteria = {'isActive': true};
            const dbError = {
                name: 'GenericError',
                err: 'This is a generic error message',
                code: 12345
            };
            const expectedResult = new Result(
                HttpStatus.INTERNAL_SERVER_ERROR,
                new ErrorMessage(
                    AppStatus.INTERNAL_ERROR,
                    AppStatus.getStatusText(AppStatus.INTERNAL_ERROR),
                    {message: _$.GENERIC_ERROR_MESSAGE}
                )
            );

            //mock
            teacherModelMock.expects('find')
                .once()
                .withExactArgs(findAllCriteria)
                .rejects(dbError);

            loggerMock.expects('error')
                .once()
                .withExactArgs(dbError)
                .resolves();

            //WHEN
            const result = await teacherService.getAll();

            //THEN
            teacherModelMock.verify();
            loggerMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult);
        })
    });
});

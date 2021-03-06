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
    const teacherId = '123abc456';
    const consumerId = 'bacwe1234rty';

    const INTERNAL_ERROR_RESULT = new Result(
        HttpStatus.INTERNAL_SERVER_ERROR,
        new ErrorMessage(
            AppStatus.INTERNAL_ERROR,
            AppStatus.getStatusText(AppStatus.INTERNAL_ERROR),
            {message: _$.GENERIC_ERROR_MESSAGE}
        )
    );
    const TEACHER_NOT_FOUND_RESULT = new Result(
        HttpStatus.NOT_FOUND,
        new ErrorMessage(
            AppStatus.TEACHER_NOT_FOUND,
            AppStatus.getStatusText(AppStatus.TEACHER_NOT_FOUND),
            {id: teacherId}
        )
    );

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
            const result = await teacherService.createTeacher(input, consumerId);

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
            const result = await teacherService.createTeacher(req);

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

            const expectedResult = INTERNAL_ERROR_RESULT;

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
            const result = await teacherService.createTeacher(req);

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

            const expectedResult = INTERNAL_ERROR_RESULT;

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
            const result = await teacherService.createTeacher(req);

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
            const result = await teacherService.createTeacher(req);

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
            const expectedResult = INTERNAL_ERROR_RESULT;

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

    describe('Get By Id', () => {
        it('should return a Teacher by teacherId', async () => {
            //GIVEN
            const searchCriteria = {
                _id: teacherId,
                isActive: true
            };

            //mock
            teacherModelMock.expects('findOne')
                .once()
                .withExactArgs(searchCriteria)
                .resolves(validTeacher);

            const expectedResult = new Result(HttpStatus.OK, validTeacher);

            //WHEN
            const result = await teacherService.getById(teacherId);

            //THEN
            teacherModelMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult);
        });

        it('should handle Teacher not found', async () => {
            //GIVEN
            const searchCriteria = {
                _id: teacherId,
                isActive: true
            };

            //mock
            teacherModelMock.expects('findOne')
                .once()
                .withExactArgs(searchCriteria)
                .resolves(null);

            const expectedResult = TEACHER_NOT_FOUND_RESULT;

            //WHEN
            const result = await teacherService.getById(teacherId);

            //THEN
            teacherModelMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult);
        });

        it('should handle generic error', async () => {
            //GIVEN
            const searchCriteria = {
                _id: teacherId,
                isActive: true
            };
            const dbError = {
                name: 'GenericError',
                err: 'This is a generic error message',
                code: 12345
            };

            const expectedResult = INTERNAL_ERROR_RESULT;

            //mock
            teacherModelMock.expects('findOne')
                .once()
                .withExactArgs(searchCriteria)
                .rejects(dbError);

            loggerMock.expects('error')
                .once()
                .withExactArgs(dbError)
                .resolves();

            //WHEN
            const result = await teacherService.getById(teacherId);

            //THEN
            teacherModelMock.verify();
            loggerMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult);
        })

    });

    describe('Update By Id', () => {
        const searchCriteria = {
            _id: teacherId
        };
        const requestBody = Object.assign({}, validTeacher);

        it('should update a Teacher by teacherId', async () => {
            //GIVEN
            requestBody.password = '';
            requestBody.lastName = 'differentLastname';

            const updatedObj = Object.assign({}, requestBody);
            updatedObj._updatedBy = consumerId;

            //mock
            teacherModelMock.expects('findOne')
                .once()
                .withExactArgs(searchCriteria)
                .resolves(validTeacher);
            teacherModelMock.expects('findOneAndUpdate')
                .once()
                .withExactArgs(searchCriteria, updatedObj, sinon.match.object)
                .resolves(updatedObj);

            const expectedResult = new Result(HttpStatus.OK, updatedObj);

            //WHEN
            const result = await teacherService.updateById(teacherId, requestBody, consumerId);

            //THEN
            teacherModelMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult);
        });

        it('should update a Teacher password by teacherId', async () => {
            //GIVEN
            const encryptedPassword = 'asbasd234adfavaf';
            requestBody.password = 'D!ff3r3ntP@$$wr0d';

            const updatedObj = Object.assign({}, requestBody);
            updatedObj._updatedBy = consumerId;
            updatedObj.password = encryptedPassword;

            //mock
            teacherModelMock.expects('findOne')
                .once()
                .withExactArgs(searchCriteria)
                .resolves(validTeacher);
            teacherModelMock.expects('findOneAndUpdate')
                .once()
                .withExactArgs(searchCriteria, updatedObj, sinon.match.object)
                .resolves(updatedObj);
            bcryptMock.expects('hash')
                .once()
                .withExactArgs(requestBody.password, _$.SALT)
                .resolves(encryptedPassword);

            const expectecResult = new Result(HttpStatus.OK, updatedObj);

            //WHEN
            const result = await teacherService.updateById(teacherId, requestBody, consumerId);

            //THEN
            teacherModelMock.verify();
            bcryptMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectecResult);
        });

        it('should handle Teacher not found', async () => {
            //mock
            teacherModelMock.expects('findOne')
                .once()
                .withExactArgs(searchCriteria)
                .resolves(null);
            teacherModelMock.expects('findOneAndUpdate')
                .never();

            const expectedResult = TEACHER_NOT_FOUND_RESULT;

            //WHEN
            const result = await teacherService.updateById(teacherId, requestBody, consumerId);

            //THEN
            teacherModelMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult);
        });

        it('should handle invalid Teacher data', async () => {
            //GIVEN
            requestBody.password = '';

            const updatedObj = Object.assign({}, requestBody);
            updatedObj._updatedBy = consumerId;

            //mock
            teacherModelMock.expects('findOne')
                .once()
                .withExactArgs(searchCriteria)
                .resolves(validTeacher);
            teacherModelMock.expects('findOneAndUpdate')
                .once()
                .withExactArgs(searchCriteria, updatedObj, sinon.match.object)
                .resolves(null);

            const expectedResult = new Result(
                HttpStatus.UNPROCESSABLE_ENTITY,
                new ErrorMessage(
                    AppStatus.INVALID_TEACHER_DATA,
                    AppStatus.getStatusText(AppStatus.INVALID_TEACHER_DATA),
                    {id: teacherId}
                )
            );
            //WHEN
            const result = await teacherService.updateById(teacherId, requestBody, consumerId);

            //THEN
            teacherModelMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult);
        })
    });
    describe('Delete By Id', function () {

        it('should delete an existing teacher', async () => {
            //GIVEN
            const searchCriteria = {
                _id: teacherId
            };
            const teacherObject = Object.assign({}, validTeacher);
            teacherObject.isActive = false;
            teacherObject._updatedBy = consumerId;

            const expectedResult = new Result(HttpStatus.NO_CONTENT, {});

            //mocks
            teacherModelMock.expects('findOne')
                .once()
                .withExactArgs(searchCriteria)
                .resolves(validTeacher);

            teacherModelMock.expects('findOneAndUpdate')
                .once()
                .withExactArgs(searchCriteria, teacherObject, {runValidators: true})
                .resolves(null);

            //WHEN
            const result = await teacherService.deleteById(teacherId, consumerId);

            //THEN
            teacherModelMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult);
        });

        it('should not delete a unknown teacher', async () => {
            //GIVEN
            const searchCriteria = {
                _id: teacherId
            };

            const expectedResult = TEACHER_NOT_FOUND_RESULT;

            //mocks
            teacherModelMock.expects('findOne')
                .once()
                .withExactArgs(searchCriteria)
                .resolves(null);

            teacherModelMock.expects('findOneAndUpdate')
                .never();

            //WHEN
            const result = await teacherService.deleteById(teacherId, consumerId);

            //THEN
            teacherModelMock.verify();
            assert.isObject(result);
            assert.deepEqual(result, expectedResult);
        });
    });
});

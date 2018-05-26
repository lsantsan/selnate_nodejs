'use strict';

/* eslint-disable max-statements */

const chai = require('chai');
const assert = chai.assert;
const sinon = require('sinon').createSandbox();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const AppStatus = require('./../common/app-status');
const authService = require('./auth.service');
const TeacherModel = require('./../teachers/teachers.model');
const ErrorMessage = require('./../common/error-message.class');
const Logger = require('../../../../config/logger/logger.config');
const Result = require('./../common/result.class');


describe('Auth Service', function () {

    describe('Post', function () {
        let bcryptMock = null;
        let jwtMock = null;
        let loggerMock = null;

        const validRequest = {
            username: 'myusername',
            password: 'MySuperPassword'
        };

        beforeEach(() => {
            bcryptMock = sinon.mock(bcrypt);
            jwtMock = sinon.mock(jwt);
            loggerMock = sinon.mock(Logger);
        });
        afterEach(() => {
            sinon.restore();
        });

        it('should login valid teacher', async () => {
            //GIVEN
            const input = Object.create(validRequest);
            const jwtSecret = 'mySecret';

            const dbResult = {
                _id: '134dadfdfa',
                firstName: 'FirstName',
                lastName: 'LastName',
                username: 'myusername',
                password: 'adjkfqer234234'
            };

            const expectedResult = new Result(HttpStatus.OK, {
                auth: true,
                token: 'afafqerqalkjaljqp91324lk'
            });

            //mock
            bcryptMock.expects('compare')
                .once()
                .withExactArgs(input.password, dbResult.password)
                .resolves(true);

            jwtMock.expects('sign')
                .withExactArgs({id: dbResult._id}, jwtSecret, {expiresIn: 7200})
                .resolves(expectedResult.body.token);

            const mockFindOne = {
                select: function () {
                    return dbResult;
                }
            };

            sinon.stub(TeacherModel, 'findOne')
                .returns(mockFindOne);

            //WHEN
            const result = await authService.post(input, jwtSecret);

            //THEN
            bcryptMock.verify();
            //teacherModelMock.verify();
            assert.deepEqual(result, expectedResult);
        });

        it('should handle invalid username', async () => {
            //GIVEN
            const input = Object.create(validRequest);
            input.username = 'invalidUsername';

            const expectedResult = new Result(
                HttpStatus.UNAUTHORIZED,
                new ErrorMessage(
                    AppStatus.LOGIN_NOT_VALID,
                    AppStatus.getStatusText(AppStatus.LOGIN_NOT_VALID),
                    null
                )
            );
            const dbResult = null;
            const jwtSecret = 'mySecret';

            //mock
            bcryptMock.expects('compare')
                .never();

            jwtMock.expects('sign')
                .never();

            const mockFindOne = {
                select: function () {
                    return dbResult;
                }
            };
            sinon.stub(TeacherModel, 'findOne')
                .returns(mockFindOne);

            loggerMock.expects('error')
                .once()
                //.withExactArgs(loginError)
                .resolves();

            //WHEN
            const result = await authService.post(input, jwtSecret);

            //THEN
            loggerMock.verify();
            bcryptMock.verify();
            jwtMock.verify();
            assert.deepEqual(result, expectedResult);
        });

        it('should handle invalid password', async () => {
            //GIVEN
            const input = Object.create(validRequest);
            input.password = 'invalidPassword';

            const expectedResult = new Result(
                HttpStatus.UNAUTHORIZED,
                new ErrorMessage(
                    AppStatus.LOGIN_NOT_VALID,
                    AppStatus.getStatusText(AppStatus.LOGIN_NOT_VALID),
                    null
                )
            );
            const dbResult = {
                _id: '134dadfdfa',
                firstName: 'FirstName',
                lastName: 'LastName',
                username: 'myusername',
                password: 'adjkfqer234234'
            };
            const jwtSecret = 'mySecret';

            //mock
            bcryptMock.expects('compare')
                .once()
                .withExactArgs(input.password, dbResult.password)
                .resolves(false);

            jwtMock.expects('sign')
                .never();

            const mockFindOne = {
                select: function () {
                    return dbResult;
                }
            };
            sinon.stub(TeacherModel, 'findOne')
                .returns(mockFindOne);

            loggerMock.expects('error')
                .once()
                //.withExactArgs(loginError)
                .resolves();

            //WHEN
            const result = await authService.post(input, jwtSecret);

            //THEN
            loggerMock.verify();
            bcryptMock.verify();
            jwtMock.verify();
            assert.deepEqual(result, expectedResult);
        });

        it('should handle generic error', async () => {
            //GIVEN
            const input = Object.create(validRequest);
            const error = new Error('Generic Error');

            const expectedResult = new Result(
                HttpStatus.INTERNAL_SERVER_ERROR,
                new ErrorMessage(
                    AppStatus.INTERNAL_ERROR,
                    AppStatus.getStatusText(AppStatus.INTERNAL_ERROR),
                    error
                )
            );

            const jwtSecret = 'mySecret';

            //mock
            bcryptMock.expects('compare')
                .never();

            jwtMock.expects('sign')
                .never();

            const mockFindOne = {
                select: function () {
                     throw error;
                }
            };
            sinon.stub(TeacherModel, 'findOne')
                .returns(mockFindOne);

            loggerMock.expects('error')
                .once()
                //.withExactArgs(loginError)
                .resolves();

            //WHEN
            const result = await authService.post(input, jwtSecret);

            //THEN
            loggerMock.verify();
            bcryptMock.verify();
            jwtMock.verify();
            assert.deepEqual(result, expectedResult);

        });
    });

});

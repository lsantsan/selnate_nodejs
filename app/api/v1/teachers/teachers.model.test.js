/* eslint-disable no-unused-expressions,no-underscore-dangle,max-statements */
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const TeacherModel = require('./teachers.model');

describe('Teacher Model', function () {
    describe('Create', function () {

        it('should apply validations', async () => {
            const _firstName = ' firstName1 ';
            const _lastName = ' lastName1 ';
            const _username = ' USERName1 ';
            const _password = ' P@$$w0rd ';

            const teacher1 = new TeacherModel({
                firstName: _firstName,
                lastName: _lastName,
                username: _username,
                password: _password,
                isAdmin: true,
                isActive: true
            });

            await teacher1.validate();
            assert.strictEqual(teacher1._doc.firstName, _firstName.trim());
            assert.strictEqual(teacher1._doc.lastName, _lastName.trim());
            assert.strictEqual(teacher1._doc.username, _username.trim().toLowerCase());
            assert.strictEqual(teacher1._doc.password, _password.trim());
        });

        it('should have validation error for empty teacher', async () => {
            const emptyTeacher = new TeacherModel({});
            const requiredProperties = ['firstName', 'lastName', 'username', 'password', 'isAdmin', 'isActive'];

            try {
                await emptyTeacher.validate();
            } catch (reason) {
                expect(reason).to.not.be.null;
                expect(reason).to.have.property('name', 'ValidationError');
                assert.hasAllKeys(reason.errors, requiredProperties);
            }
        });

        it('should have validation error for boolean type', async () => {
            const invalidTeacher = new TeacherModel({
                firstName: 'firstName1',
                lastName: 'lastName1',
                username: 'USERName1',
                password: 'P@$$w0rd',
                isAdmin: 'abc',
                isActive: 'abc'
            });

            try {
                await invalidTeacher.validate();
            } catch (reason) {
                expect(reason).to.not.be.null;
                expect(reason).to.have.property('name', 'ValidationError');
                expect(reason.errors).to.have.property('isActive');
                expect(reason.errors).to.have.property('isAdmin');

            }

        });

    });

});
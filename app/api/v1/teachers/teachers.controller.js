'use strict';

const express = require('express');
const teachersService = require('./teachers.service');
const middleware = require('./../common/middleware-util');
const _$ = require('./../common/constants');
const VerifyToken = middleware.verifyToken;
const CheckRole = middleware.checkRole;


const router = express.Router();

router.post('/', VerifyToken, CheckRole(_$.ROLES.ADMIN), function (req, res) {
    teachersService.createTeacher(req.body, req.consumerId)
        .then(result => {
            res.status(result.status)
                .send(result.body);
        });
});

router.get('/', VerifyToken, CheckRole(_$.ROLES.ADMIN), function (req, res) {
    teachersService.getAll()
        .then(result => {
            res.status(result.status)
                .send(result.body);
        });
});

router.get('/:id', VerifyToken, CheckRole(_$.ROLES.ADMIN, _$.ROLES.TEACHER), function (req, res) {
    teachersService.getById(req.params.id)
        .then(result => {
            res.status(result.status)
                .send(result.body);
        });
});

router.put('/:id', VerifyToken, CheckRole(_$.ROLES.ADMIN, _$.ROLES.TEACHER), function (req, res) {
    teachersService.updateById(req.params.id, req.body, req.consumerId)
        .then(result => {
            res.status(result.status)
                .send(result.body);
        });
});

router.delete('/:id', VerifyToken, CheckRole(_$.ROLES.ADMIN), function (req, res) {
    teachersService.deleteById(req.params.id, req.consumerId)
        .then(result => {
            res.status(result.status)
                .send();
        });
});

module.exports = router;

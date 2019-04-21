'use strict';

const express = require('express');
const teachersService = require('./teachers.service');
const VerifyToken = require('./../common/middleware-util');


const router = express.Router();

router.post('/', VerifyToken, function (req, res) {
    teachersService.createTeacher(req.body, req.consumerId)
        .then(result => {
            res.status(result.status)
                .send(result.body);
        });
});

router.get('/', VerifyToken, function (req, res) {
    teachersService.getAll()
        .then(result => {
            res.status(result.status)
                .send(result.body);
        });
});

router.get('/:id', VerifyToken, function (req, res) {
    teachersService.getById(req.params.id)
        .then(result => {
            res.status(result.status)
                .send(result.body);
        });
});

router.put('/:id', VerifyToken, function (req, res) {
    teachersService.updateById(req.params.id, req.body, req.consumerId)
        .then(result => {
            res.status(result.status)
                .send(result.body);
        });
});

module.exports = router;
'use strict';

const express = require('express');
const teachersService = require('./teachers.service');
const VerifyToken = require('./../common/middleware-util');


const router = express.Router();

router.post('/', VerifyToken, function (req, res) {
    teachersService.post(req.body, req.consumerId)
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

router.get('/:username', VerifyToken, function (req, res) {
    teachersService.getByUsername(req.params.username)
        .then(result => {
            res.status(result.status)
                .send(result.body);
        });
});

module.exports = router;
'use strict';

const express = require('express');
const teachersService = require('./teachers.service');

const router = express.Router();

router.post('/', function (req, res) {
    teachersService.post(req.body)
        .then(result => {
            res.status(result.status)
                .send(result.body);
        });
});

module.exports = router;
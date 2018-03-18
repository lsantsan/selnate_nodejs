'use strict';

const express = require('express');
const teachersService = require('./teachers.service');

const router = express.Router();

router.post('/', function (req, res) {
    const result = teachersService.post(req);
    res.status(200)
        .send(result);
});

module.exports = router;
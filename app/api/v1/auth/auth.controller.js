'use strict';

const express = require('express');
const authService = require('./auth.service');

const router = express.Router();

router.post('/login', function (req, res) {
    const jwtSecret = req.app.get('jwtSecret');
    authService.post(req.body, jwtSecret)
        .then(result => {
            res.status(result.status)
                .send(result.body);
        });
});

module.exports = router;
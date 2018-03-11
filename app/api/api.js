'use strict';

var express = require('express');
var v1Router = require('./v1/v1');

var router = express.Router();

router.use('/v1', v1Router);

module.exports = router;
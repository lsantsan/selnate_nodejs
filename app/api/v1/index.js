'use strict'

var express = require('express');
var router = express.Router();

var teacherController = require('./teachers/teachers.controller');

router.use('/teachers', teacherController);

module.exports = router;

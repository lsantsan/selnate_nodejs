'use strict'

var express = require('express');
var teacherController = require('./teachers/teachers.controller');

var router = express.Router();

router.use('/teachers', teacherController);

module.exports = router;

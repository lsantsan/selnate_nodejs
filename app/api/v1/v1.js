'use strict';

const express = require('express');
const teacherController = require('./teachers/teachers.controller');
const authController = require('./auth/auth.controller');

const router = express.Router();

router.use('/teachers', teacherController);
router.use('/auth', authController);

module.exports = router;

'use strict';

var express = require('express');
var teachersService = require('./teachers.service');

var router = express.Router();

router.post('/', teachersService.post);
/*
router.get('/', function (req, res) {
    TeacherModel.find({}, function (err, teachers) {
        if(err){
            return res.status(500).send(err);
        }
        res.status(200).send(teachers);
    });
});

router.get('/:id', function (req, res) {
    Teacher.findById(req.params.id, function (err, teacher) {
        if(err){
            return res.status(500).send("Problem happened.");
        }

        if(!teacher){
            return res.status(400).send("Teacher Not Found");
        }

        res.status(200).send(teacher);
    });
});
router.get('/:username', function (req, res) {
    TeacherModel.findOne({'username': req.params.username}, function (err, teacher) {
        if(err){
            return res.status(500).send(err);
        }

        if(!teacher){
            return res.status(400).send("Teacher Not Found");
        }

        res.status(200).send(teacher);
    });
});
*/

module.exports = router;
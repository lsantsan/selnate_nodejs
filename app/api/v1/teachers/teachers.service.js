'use strict'

var TeacherModel = require('./teachers.model');

var post = function (req, res) {
    TeacherModel.create({
            name: req.body.name,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            isAdmin: req.body.isAdmin,
            isActive: req.body.isActive
        },
        function (err, teacher) {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send(teacher);
        });

};


module.exports = {
    post: post
};







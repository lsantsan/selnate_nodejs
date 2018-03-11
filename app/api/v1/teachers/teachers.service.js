'use strict';

var TeacherModel = require('./teachers.model');

var post = function (req, res) {
    /*TeacherModel.create({
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
        });*/
    var dogs = [{
        id: 1,
        name: 'Corgi',
        origin: 'Wales',
        breeds: [
            'Pembroke',
            'Cardigan'
        ]
    }, {
        id: 2,
        name: 'Husky',
        breeds: [
            'Alaskan',
            'Siberian',
            'Labrador',
            'Sakhalin'
        ]
    }];
    res.status(200).send(dogs);

};


module.exports = {
    post: post
};







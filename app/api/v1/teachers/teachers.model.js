var mongoose = require('mongoose');
var TeacherSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    isAdmin: Boolean,
    isActive: Boolean
});

mongoose.model('Teachers', TeacherSchema);

module.exports = mongoose.model('Teachers');
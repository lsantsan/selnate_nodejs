'use strict';

const mongoose = require('mongoose');
const mongooseHistory = require('mongoose-history');

mongoose.Promise = global.Promise;

const TeacherSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    _updatedBy: {
        type: String,
        required: true,
        trim: true,
        select: false
    }
});

TeacherSchema.plugin(mongooseHistory);
mongoose.model('Teachers', TeacherSchema);

module.exports = mongoose.model('Teachers');
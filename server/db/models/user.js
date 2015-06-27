'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    github: {
        id: String,
        displayName: String,
        username: String,
        profileUrl: String,
        reposUrl: String,
        image: String,
        location: String
    }
});

mongoose.model('User', schema);
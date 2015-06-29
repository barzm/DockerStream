'use strict';
var router = require('express').Router();
module.exports = router;
var request = require('request-promise');
var User = require('mongoose').model('User');
var Pipeline = require('mongoose').model('Pipeline');


router.get('/', function (req, res, next) {
    
    User.findById(req.user._id)
    .populate('pipelines')
    .exec()
    .then(function (user) {
    	console.log('got user',user);
        res.json(user);
    })
    .then(null, next)

})
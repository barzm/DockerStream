'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var Pipeline = mongoose.model('Pipeline')
var User = mongoose.model('User');

var ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).end();
	}
};



router.post('/', ensureAuthenticated, function (req, res) {
	var pipelineId;
	Pipeline.create({
		user: req.user._id,
		name: req.body.name
	})
	.then(function (pipeline) {
		pipelineId = pipeline._id;
		return User.findById(req.user._id)
		.exec();
	})
	.then(function (user) {
		user.pipelines.push(pipelineId);
		user.save(function (err, savedUser) {
			res.json(savedUser);
		})
	})
});
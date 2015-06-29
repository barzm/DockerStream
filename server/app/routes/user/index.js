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
		res.json(user);
	})
	.then(null, next)

})

router.put('/', function (req, res, next) {
	var pipelines = [];
	var newPipelines = [];
	var counter = 0;
	var len = Object.keys(req.body).length
	var newPipeline;
	for (var pipelineObj in req.body) {
		newPipeline = req.body[pipelineObj]['pipeline'];
		newPipelines.push(newPipeline);
		Pipeline.findById(req.body[pipelineObj].pipelineId)
		.exec()
		.then(function (pipeline) {
			console.log(newPipelines);
			pipeline.pipeline = newPipelines.shift();
			pipeline.save(function (err, savedPipeline) {
				counter++;
				pipelines.push(savedPipeline)
				if (counter === len) res.json(pipelines);
			})
		})
	}

})
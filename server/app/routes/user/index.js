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
	var updatedPipeline = req.body.pipelines;
	var deletedImageId = req.body.image;
	var pipelines = [];
	var newPipelines = [];
	var counter = 0;
	var len = Object.keys(updatedPipeline).length
	var newPipeline;
	for (var pipelineObj in updatedPipeline) {
		newPipeline = updatedPipeline[pipelineObj]['pipeline'];
		newPipelines.push(newPipeline);
		Pipeline.findById(updatedPipeline[pipelineObj].pipelineId)
		.exec()
		.then(function (pipeline) {
			pipeline.pipeline = newPipelines.shift();
			pipeline.save(function (err, savedPipeline) {
				counter++;
				pipelines.push(savedPipeline)
				if (counter === len) res.json(pipelines);
			})
		})
	}

})
'use strict';
var router = require('express').Router();
module.exports = router;
var request = require('request-promise');
var User = require('mongoose').model('User');
var Pipeline = require('mongoose').model('Pipeline');
var cleanup = require('../../modules/dockercleanup');
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
	var pipelines = [];
	var newPipelines = [];
	var counter = 0;
	var len = Object.keys(updatedPipeline).length
	var newPipeline;
	cleanup.deleteImage(req.body.image)
	.then(function(){
		throw new Error();
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
			.then(null,function(err){
				err.message = "There was a problem deleting a pipe from your pipeline";
				next(err);
			})
		}
	})
	.catch(function(err){
		err.message ="There was a problem deleting a pipe from your pipeline: " + req.body.image;
		err.status = 911;
		next(err);
	})
})

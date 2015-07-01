'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require('lodash');
var mongoose = require('mongoose');
var Pipeline = mongoose.model('Pipeline')
var User = mongoose.model('User');
var run = require('../../modules/dockerun');
var uuid = require('node-uuid'); 
var request = require('request-promise');



var ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).end();
	}
};

// router.get('/url', ensureAuthenticated, function (req, res, next) {

// })

router.delete('/:id', ensureAuthenticated, function(req, res, next) {
	Pipeline.findByIdAndRemove(req.params.id)
	.exec()
	.then(function(removed) {
		return User.findById(req.user._id)
		.exec()
		.then(function(user) {
			user.pipelines = user.pipelines.filter(function(id) {
				return id.toString() !== req.params.id;
			})
			user.save(function(err, user) {

			})
		})
		.then(function(user) {
			res.json(user);
		})
	})
})

router.get('/', ensureAuthenticated, function(req, res, next) {
	if (req.query.user) {
		request({
				url: `https://api.github.com/repos/${req.query.user}/${req.query.repo}`,
				headers: {
					'User-Agent': 'Pied Pipeline',
					'Authorization': 'token ' + req.user.github.token
				}
			})
		.then(function (response) {
			res.json(JSON.parse(response))
		})
		.catch(next);
	} else {
		User.findById(req.user._id)
		.populate('pipelines')
		.exec()
		.then(function(user) {
			res.json(user);
		})
		.then(null, next)
	}
})


router.put('/', ensureAuthenticated, function(req, res, next) {
	Pipeline.findById(req.body.id)
		.exec()
		.then(function(pipeline) {
			console.log("adding pipe to pipeline")
			var newPipe = {
				name: req.body.repo.name,
				gitUrl: req.body.repo.html_url,
				description: req.body.repo.description,
				order: pipeline.pipeline.length,
				imageId: uuid.v4()
			};
			pipeline.pipeline.push(newPipe);
			console.log('new pipe pushed',pipeline);
			pipeline.save(function(err, updatedPipeline) {
				console.log("NEW PIPE IN PUT ROUTE: \n",newPipe,"\n")
				run.getRepository(newPipe.gitUrl,updatedPipeline._id,req.user.github.token)
				.then(function(downloadPath){
					console.log('DOWNLOAD PATH ', downloadPath);
					console.log('get repo returned: ',newPipe.imageId,newPipe.gitUrl)
					var targetDir = './downloads';
					return run.buildImage(newPipe.imageId,targetDir,newPipe.gitUrl);
				})
				.then(function(){
					res.json(updatedPipeline);
				})
				.catch(function(err){
					console.log("ERROR in router put",err.message,err.stack.split('\n'));
				})
			})
		})
	})
})

router.post('/', ensureAuthenticated, function(req, res) {
	var pipelineId;
	Pipeline.create({
		user: req.user._id,
		name: req.body.name
	})
	.then(function(pipeline) {
		pipelineId = pipeline._id;
		return run.makeContainerDir(pipeline._id)
	})
	.then(function(){
		return User.findById(req.user._id)
		.exec();
	})
	.then(function(user) {
		user.pipelines.unshift(pipelineId);
		user.save(function(err, savedUser) {
			return User.findById(req.user._id)
			.populate('pipelines')
			.exec()
			.then(function(user) {
				res.json(user);
			})
		})
<<<<<<< HEAD
	})
});
=======
});
>>>>>>> master

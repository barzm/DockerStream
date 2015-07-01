'use strict';
var Docker = require('dockerode-promise');
var router = require('express').Router();
var exec = require('child_process').exec;
var run = require('../../modules/dockerun.js');

module.exports = router;

router.get('/',function(req,res,next){
	console.log('route hit');
	run.run(req.query.id,req.query.callback)
	.then(function(path){
		console.log('sending data back')
		console.log(path);
		res.send(path);
	})
	.then(null,function(err){
		console.log("error sending data back",err)
		res.status(500).end();
	})

})

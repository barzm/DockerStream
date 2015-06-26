'use strict';
var Docker = require('dockerode-promise'); 
var router = require('express').Router();
var exec = require('child_process').exec;
module.exports = router;


router.get('/',function(req,res,next){
	console.log('running yo shit');
	// var pipelineId = req.query.id; 
	// var callbackUrl = req.query.callbackUrl; 
	exec('cd public/applet; docker build .',function(err,stdout,stderr){
		console.log('err', err);
		console.log('stdout ',stdout);
		console.log('stderr',stderr);
	})
	res.send("okay"); 

})
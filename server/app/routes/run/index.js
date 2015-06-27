'use strict';
var Docker = require('dockerode-promise'); 
var router = require('express').Router();
var exec = require('child_process').exec;
var run = require('../../modules/dockerun.js'); 
module.exports = router;

router.get('/',function(req,res,next){
	console.log('route hit');
	// var pipelineId = req.query.id; 
	// var callbackUrl = req.query.callbackUrl; 
	run.downloadRepo();
	
	res.send("okay"); 

})
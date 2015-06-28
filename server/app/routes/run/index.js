'use strict';
var Docker = require('dockerode-promise'); 
var router = require('express').Router();
var exec = require('child_process').exec;
var run = require('../../modules/dockerun.js'); 
module.exports = router;

router.get('/',function(req,res,next){
	console.log('route hit');
	run.run(); //req.user.github.token
	res.send("okay"); 

})
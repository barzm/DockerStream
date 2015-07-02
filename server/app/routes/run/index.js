'use strict';
var Docker = require('dockerode-promise');
var router = require('express').Router();
var exec = require('child_process').exec;
var run = require('../../modules/dockerun.js');
var request = require('request');
var fs = require('fs');
module.exports = router;

router.get('/',function(req,res,next){
	console.log("(HITTING ROUTE)");
	run.run(req.query.id,req.query.callback)
	.then(function(path){
		console.log("\n=========ROUTE PROMISE RESOLVED=========\n")
		console.log("THIS IS THE PATH AQUI", path);
		var read = fs.createReadStream(path.slice(1));
		if(req.query.callback){
			console.log("CALLBACK URL EXISTS");
			console.log("THIS IS THE CALLBACK URL ",req.query.callback)
			read.pipe(request.post(req.query.callback))
		}else{
			console.log("NO CALLBACK URL, STREAMING TO RES");
			read.pipe(res);
		}
	})
	.then(null,function(err){
		console.log("error sending data back",err)
		res.status(500).end();
	})
})

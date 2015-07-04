'use strict';
var Docker = require('dockerode-promise');
var router = require('express').Router();
var exec = require('child_process').exec;
var run = require('../../modules/dockerun.js');
var request = require('request');
var fs = require('fs');
module.exports = router;

router.get('/',function(req,res,next){
	run.run(req.query.id,req.query.callback)
	.then(function(path){
		var read = fs.createReadStream('../../'+path.slice(1));
		if(req.query.callback){
			request.post({url: req.query.callback,form:{key:'hello'}})
		}else{
			read.pipe(res);
		}
	})
	.then(null,function(err){
		err.message = "There was a problem running the pipeline";
		next(err); 
	})
})

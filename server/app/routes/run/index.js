'use strict';
var Docker = require('dockerode-promise');
var router = require('express').Router();
var exec = require('child_process').exec;
var run = require('../../modules/dockerun.js');
var request = require('request');
var fs = require('fs');
var path = require('path');
module.exports = router;

router.get('/',function(req,res,next){
	run.run(req.query.id,req.query.callback)
	.then(function(retPath){
		console.log("THIS IS THE retPath THAT THE BLORP HAS MADE", retPath);
		var read = fs.createReadStream(retPath);
		if(req.query.callback){
			// REFACTOR THIS
			request.post({url: req.query.callback,form:{key:'hello'}})
		}else{
			read.pipe(res);
			read.on('end',function(){
				var rmfolder = path.join(retPath,'../../');
				exec('sudo rm -rf '+rmfolder); 
			})
		}
	})
	.then(null,function(err){
		err.customMessage = "There was a problem running the pipeline";
		next(err);
	})
})

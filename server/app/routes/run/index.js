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
		read.on('error',function(err){
			res.send(err);
		})
		read.on('end',function(){
			if(req.query.callback){
				res.status(200).end();
			}
			var rmfolder = path.join(retPath,'../../');
			exec('sudo rm -rf '+rmfolder);
		})

		if(req.query.callback){
			try {
				read.pipe(request.post(req.query.callback));
			} catch (e) {
				res.send(e);
			}
		}else{
			read.pipe(res);
		}
	})
	.then(null,function(err){
		err.customMessage = "There was a problem running the pipeline";
		next(err);
	})
})
